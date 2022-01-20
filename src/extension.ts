import {
    commands,
    DocumentFilter,
    ExtensionContext,
    languages,
    StatusBarAlignment,
    StatusBarItem,
    window,
    workspace,
} from 'vscode';
import CypressRunnerCodeLensProvider from './codeLens/codeLensProvider';
import { CypressRunner } from './command';

export function activate(context: ExtensionContext) {
    const cypressRunner = new CypressRunner();
    let removeAllOnlyButton: StatusBarItem;

    function updateRemoveAllOnlyButton(locations: string | any[]): any {
        const removeAllOnlyOption = workspace.getConfiguration().get('cypressrunner.removeAllOnlyButton');

        if (!removeAllOnlyOption) {
            removeAllOnlyButton.hide();
            return;
        }

        if (locations.length > 0) {
            removeAllOnlyButton.show();
        } else {
            removeAllOnlyButton.hide();
        }
    }

    const runAndAddOnly = commands.registerCommand('cypress-runner.runAndAddOnly', async (argument: any) => {
        window.showInformationMessage('Remember to have your app running');
        await cypressRunner.addOnly(argument);
        cypressRunner.runCurrentFile();
    });

    const runCommand = commands.registerCommand('cypress-runner.runCommand', async () => {
        window.showInformationMessage('Remember to have your app running');
        cypressRunner.runCurrentFile();
    });

    const removeSingleOnly = commands.registerCommand('cypress-runner.removeOnly', async (argument: any) => {
        await cypressRunner.removeOnly(argument);
    });

    const docSelectors: DocumentFilter[] = [
        { pattern: workspace.getConfiguration().get('cypressrunner.codeLensSelector') },
    ];
    context.subscriptions.push(
        languages.registerCodeLensProvider(docSelectors, new CypressRunnerCodeLensProvider(updateRemoveAllOnlyButton)),
    );

    commands.registerCommand('cypress-runner.remove.all.only', cypressRunner.removeAllOnly);
    removeAllOnlyButton = window.createStatusBarItem(StatusBarAlignment.Left, 0);
    removeAllOnlyButton.text = '$(close) Remove all only';
    removeAllOnlyButton.command = 'cypress-runner.remove.all.only';
    context.subscriptions.push(removeAllOnlyButton);

    context.subscriptions.push(runAndAddOnly);
    context.subscriptions.push(runCommand);
    context.subscriptions.push(removeSingleOnly);
}

export function deactivate(): void {
    // Deactivate
}
