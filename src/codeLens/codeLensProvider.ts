import { CodeLens, CodeLensProvider, Range, TextDocument } from 'vscode';
import parseCodeForLocations from '../codeParser';
import AddCodeLens from './addCodeLens';
import RemoveCodeLens from './removeCodeLens';
import RunCodeLens from './runCypress';

interface IState {
    addCodeLenses: CodeLens[];
    removeCodeLenses: CodeLens[];
    runCodeLens: CodeLens[];
}

export const state: IState = {
    addCodeLenses: [],
    removeCodeLenses: [],
    runCodeLens: [],
};

export default class CypressRunnerCodeLensProvider implements CodeLensProvider {
    public updateRemoveOnlyButton: (locations: any[]) => any;

    constructor(updateRemoveOnlyButton: any) {
        this.updateRemoveOnlyButton = updateRemoveOnlyButton;
    }

    public async provideCodeLenses(document: TextDocument): Promise<CodeLens[]> {
        const createRangeForCodeLens = ({ line }: { line: any }) => document.lineAt(line - 1).range;

        try {
            const locations = parseCodeForLocations(document.getText());

            const addCodeLenses = locations
                .filter(({ type }) => type === 'add')
                .map(({ location }) => {
                    return new AddCodeLens(
                        createRangeForCodeLens(location.end),
                        new Range(
                            location.start.line - 1,
                            location.start.column,
                            location.end.line - 1,
                            location.end.column,
                        ),
                    );
                });

            const runCodeLens = locations
                .filter(({ type }) => type === 'remove')
                .map(({ location }) => new RunCodeLens(createRangeForCodeLens(location.end)));

            const removeCodeLenses = locations
                .filter(({ type }) => type === 'remove')
                .map(
                    ({ location }) =>
                        new RemoveCodeLens(
                            createRangeForCodeLens(location.end),
                            new Range(
                                location.start.line - 1,
                                location.start.column === 0 ? 0 : location.start.column - 1,
                                location.end.line - 1,
                                location.end.column,
                            ),
                        ),
                );

            state.addCodeLenses = addCodeLenses;
            state.removeCodeLenses = removeCodeLenses;
            state.runCodeLens = runCodeLens;

            this.updateRemoveOnlyButton(removeCodeLenses);

            return [...state.addCodeLenses, ...state.runCodeLens, ...state.removeCodeLenses];
        } catch (error) {
            return [...state.addCodeLenses, ...state.runCodeLens, ...state.removeCodeLenses];
        }
    }
}
