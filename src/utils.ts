import { workspace } from 'vscode';

export function isWindows(): boolean {
    return process.platform.includes('win32');
}

export function normalizePath(path: string): string {
    return isWindows() ? path.replace(/\\/g, '/') : path;
}

export function convertPathToWindows(path: string) {
    return isWindows() ? path.replace(/\//g, '\\') : path;
}

export function escapeRegExpForPath(s: string): string {
    return s.replace(/[*+?^${}<>()|[\]]/g, '\\$&'); // $& means the whole matched string
}

export function quote(s: string): string {
    const q = isWindows() ? '"' : `'`;
    return [q, s, q].join('');
}

const defaultTemplates = [
    {
        decline: ['skip'],
        insertAfterPriority: ['concurrent', 'test'],
        name: 'test',
    },
    {
        decline: ['skip'],
        insertAfterPriority: ['concurrent', 'it'],
        name: 'it',
    },
    {
        decline: ['skip'],
        insertAfterPriority: ['describe'],
        name: 'describe',
    },
];

export function getTemplates() {
    const configTemplates: any = workspace.getConfiguration().get('cypressrunner.templates');

    if (configTemplates.length > 0) {
        return [...defaultTemplates, ...configTemplates];
    }

    return [...defaultTemplates];
}
