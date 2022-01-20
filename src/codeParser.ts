import { parse, ParserOptions } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { getTemplates } from './utils';

const TEMPLATES = getTemplates();

export default function parseCodeForLocations(sourceCode: any) {
    const parserOptions: ParserOptions = {
        plugins: ['jsx', 'typescript'],
        sourceType: 'module',
        tokens: true,
    };

    const ast = parse(sourceCode, parserOptions);

    const gatherMembers: any = (acc: any[], member: object | null | undefined) => {
        if (t.isMemberExpression(member)) {
            if (t.isIdentifier(member.property)) {
                acc = [
                    ...acc,
                    {
                        name: member.property.name,
                        type: 'property',
                        loc: member.property.loc,
                    },
                ];

                if (t.isIdentifier(member.object)) {
                    acc = [
                        ...acc,
                        {
                            name: member.object.name,
                            type: 'object',
                            loc: member.object.loc,
                        },
                    ];
                    return gatherMembers(acc, member.object);
                }

                return gatherMembers(acc, member.object);
            }
        }

        return acc;
    };

    const getLocationFromMembers = (members: any[]) => {
        // find particular template from predefined templates e.g. test, describe
        const template = TEMPLATES.find((tmplt) => members.find((member) => member.name === tmplt.name));

        if (template) {
            // find identifiers to skip
            const decline = members.find((member) => template.decline.find((dcln: any) => dcln === member.name));

            // skip
            if (decline) {
                return null;
            }

            // also skip cases where name (test, describe) is a property e.g. /hello/.test('hello')
            const propertyMember = members.find(
                (member) => member.name === template.name && member.type === 'property',
            );
            if (propertyMember) {
                return null;
            }

            // check if only exist among members
            const only = members.find((member) => member.name === 'only');

            // remove only
            if (only) {
                return { location: only.loc, type: 'remove' };
            }

            // get first identifier according to priority
            const firstByPriority = members.find((member) =>
                template.insertAfterPriority.find((identifier: any) => identifier === member.name),
            );

            // add only
            if (firstByPriority) {
                return { location: firstByPriority.loc, type: 'add' };
            }
        }
    };

    const locations: { location: any; type: string }[] = [];

    const visitor = {
        // visit every callExpression
        // eslint-disable-next-line @typescript-eslint/naming-convention
        CallExpression(callPath: { node: { callee: any } }) {
            const callee = callPath.node.callee;

            // act accordin to each case
            // tagTemplate with further memberExpressions
            if (t.isTaggedTemplateExpression(callee)) {
                const tag = callee.tag;
                const members = gatherMembers([], tag);
                const properLocation = getLocationFromMembers(members);

                if (properLocation) {
                    locations.push(properLocation);
                    return;
                }
            }

            // memberExpressions
            if (t.isMemberExpression(callee)) {
                const members = gatherMembers([], callee);
                const properLocation = getLocationFromMembers(members);

                if (properLocation) {
                    locations.push(properLocation);
                    return;
                }
            }

            // calle straight identifier
            if (t.isIdentifier(callee)) {
                // find particular template from predefined templates e.g. test, describe
                const template = TEMPLATES.find((ident) => ident.name === callee.name);

                if (template) {
                    locations.push({ location: callee.loc, type: 'add' });
                    return;
                }
            }
        },
    };

    traverse(ast, visitor);

    return locations;
}
