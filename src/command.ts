import { commands, Range, Terminal, window } from 'vscode';
import { state } from './codeLens/codeLensProvider';
import { CypressRunnerConfig } from './config';
import { quote } from './utils';

export class CypressRunner {
    private terminal: Terminal | null;

    private readonly config = new CypressRunnerConfig();

    constructor() {
        this.setup();
    }

    public async runCurrentFile(): Promise<void> {
        const editor = window.activeTextEditor;

        if (!editor) {
            return;
        }

        await editor.document.save();

        const filePath = editor.document.fileName;

        const command = this.buildCypressCommand(filePath);

        await this.goToCwd();
        await this.runTerminalCommand(command);
    }

    public async addOnly(tokenRange: Range) {
        window.activeTextEditor?.edit((editBuilder) => {
            editBuilder.insert(tokenRange.end, '.only');
        });
    }

    public async removeOnly(tokenRange: Range) {
        window.activeTextEditor?.edit((editBuilder) => {
            editBuilder.delete(tokenRange);
        });
    }

    public async removeAllOnly() {
        state.removeCodeLenses.forEach((codeLens) => {
            const tokenRange = codeLens?.command?.arguments?.[0];

            if (tokenRange) {
                window.activeTextEditor?.edit((editBuilder) => {
                    editBuilder.delete(tokenRange);
                });
            }
        });
    }

    /* Private methods */

    private buildCypressCommand(filePath: string): string {
         const args = this.buildCypressArgs(filePath);
     
        return `${this.config.cypressCommand} --spec ${quote(filePath)} ${args.join(' ')}`;
    }

    private buildCypressArgs(filePath: string): string[] {
        const args: string[] = [];
        
        const cypressConfigPath = this.config.getCypressConfigPath(filePath);
        if (cypressConfigPath) {
          args.push('--config-file');
          args.push(quote(cypressConfigPath));
        }
    
        
        if (this.config.runOptions) {
          this.config.runOptions.forEach((option) => args.push(option));
        }
        
        return args;
      }
    


    private async goToCwd() {
        if (this.config.changeDirectoryToWorkspaceRoot) {
            await this.runTerminalCommand(`cd ${quote(this.config.cwd)}`);
        }
    }

    private async runTerminalCommand(command: string) {
        if (!this.terminal) {
            this.terminal = window.createTerminal('cypress');
        }
        this.terminal.show(this.config.preserveEditorFocus);
        await commands.executeCommand('workbench.action.terminal.clear');
        this.terminal.sendText(command);
    }

    private setup() {
        window.onDidCloseTerminal(() => {
            this.terminal = null;
        });
    }
}
