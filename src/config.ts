import * as fs from 'fs';
import { window, workspace } from 'vscode';
import { isWindows, normalizePath, quote } from './utils';
import path = require('path');

export class CypressRunnerConfig {
    public get changeDirectoryToWorkspaceRoot(): boolean | null | undefined {
        return workspace.getConfiguration().get('cypressrunner.changeDirectoryToWorkspaceRoot');
    }

    getCypressConfigPath(targetPath: string): string {
        // custom
        const configPath: string | undefined = workspace.getConfiguration().get('cypressrunner.configPath');
        if (!configPath) {
            return this.findConfigPath(targetPath);
        }

        // default
        return normalizePath(path.join(this.currentWorkspaceFolderPath, configPath));
    }

    public get cypressCommand(): string {
        // custom
        const cypressCommand = workspace.getConfiguration().get('cypressrunner.cypressCommand');
        if (cypressCommand) {
            return <string>cypressCommand;
        }

        return isWindows() ? `node ${quote(this.cypressBinPath)} run` : `${quote(this.cypressBinPath)} run`;
    }

    private findConfigPath(targetPath?: string): string {
        if (window.activeTextEditor !== undefined) {
            let currentFolderPath: string = targetPath || path.dirname(window.activeTextEditor.document.fileName);
            let currentFolderConfigPath: string;
            do {
                for (const configFilename of ['cypress.json']) {
                    currentFolderConfigPath = path.join(currentFolderPath, configFilename);

                    if (fs.existsSync(currentFolderConfigPath)) {
                        return currentFolderConfigPath;
                    }
                }
                currentFolderPath = path.join(currentFolderPath, '..');
            } while (currentFolderPath !== this.currentWorkspaceFolderPath);
            return '';
        }
        return '';
    }

    public get cypressBinPath(): string {
        // custom
        let cypressPath: string | undefined = workspace.getConfiguration().get('cypressrunner.cypressPath');
        if (cypressPath) {
            return cypressPath;
        }

        // default
        const relativeCypressBin = isWindows() ? 'node_modules/cypress/bin/cypress' : 'node_modules/.bin/cypress';
        const cwd = this.cwd;

        cypressPath = path.join(cwd, relativeCypressBin);

        return normalizePath(cypressPath);
    }

    public get preserveEditorFocus(): boolean {
        return workspace.getConfiguration().get('cypressrunner.preserveEditorFocus') || false;
    }

    public projectPath(): string {
        return workspace.getConfiguration().get('cypressrunner.projectPath') || this.currentWorkspaceFolderPath;
    }

    public get runOptions(): string[] | null {
        const runOptions = workspace.getConfiguration().get('cypressrunner.runOptions');
        if (runOptions) {
            if (Array.isArray(runOptions)) {
                return runOptions;
            } else {
                window.showWarningMessage(
                    'Please check your vscode settings. "cypressrunner.runOptions" must be an Array. ',
                );
            }
        }
        return null;
    }

    public get cwd(): string {
        return (
            workspace.getConfiguration().get('cypressrunner.projectPath') ||
            this.currentPackagePath ||
            this.currentWorkspaceFolderPath
        );
    }

    private get currentPackagePath() {
        let currentFolderPath: string = path.dirname(window.activeTextEditor!.document.fileName);
        do {
            // Try to find where cypress is installed relatively to the current opened file.
            // Do not assume that cypress is always installed at the root of the opened project, this is not the case
            // such as in multi-module projects.
            const pkg = path.join(currentFolderPath, 'package.json');
            const cypress = path.join(currentFolderPath, 'node_modules', 'cypress');
            if (fs.existsSync(pkg) && fs.existsSync(cypress)) {
                return currentFolderPath;
            }
            currentFolderPath = path.join(currentFolderPath, '..');
        } while (currentFolderPath !== this.currentWorkspaceFolderPath);

        return '';
    }

    public get currentWorkspaceFolderPath(): string {
        const editor = window.activeTextEditor;
        return workspace.getWorkspaceFolder(editor!.document.uri)!.uri.fsPath;
    }
}
