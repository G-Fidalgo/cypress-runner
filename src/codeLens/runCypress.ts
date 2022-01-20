import { CodeLens, Range } from 'vscode';

export default class RunCodeLens extends CodeLens {
    constructor(range: Range) {
        super(range, {
            arguments: [],
            command: 'cypress-runner.runCommand',
            title: 'Run',
        });
    }
}
