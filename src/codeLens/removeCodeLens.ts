import { CodeLens, Range } from 'vscode';

export default class RemoveCodeLens extends CodeLens {
    constructor(range: Range, tokenRange: Range) {
        super(range, {
            arguments: [tokenRange],
            command: 'cypress-runner.removeOnly',
            title: 'Remove only',
        });
    }
}
