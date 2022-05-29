import * as vscode from 'vscode';
import { ViewLoader } from './ViewLoader';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('googelogs.openLogsViewer', () => {
      ViewLoader.showWebview(context);
    }),
    //vscode.window.registerWebviewViewProvider("googelogs.view", null)
  );
}

export function deactivate() {
}
