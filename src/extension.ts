import * as vscode from 'vscode';
import { TreeItem } from 'vscode';
import { ViewLoader } from './ViewLoader';

console.log("registered");

class Provider implements vscode.TreeDataProvider<void> {
  onDidChangeTreeData?: vscode.Event<void | void[] | null | undefined> | undefined;

  getChildren(): vscode.ProviderResult<void[]> {
    return [];
  }

  getTreeItem(): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return new TreeItem("label");
  }
}

export function activate(context: vscode.ExtensionContext) {
  console.error("activated");
  try {
    const activityBarTreeView = vscode.window.createTreeView('view', {treeDataProvider: new Provider()});
    activityBarTreeView.title = "";
    activityBarTreeView.message = "Shortcut to viewing logs, you can close this tab. 📖";
    activityBarTreeView.onDidChangeVisibility(e => {
      if (e.visible) {
        ViewLoader.showWebview(context);
      }
    });
    context.subscriptions.push(
      vscode.commands.registerCommand('googlogs.openLogsViewer', () => {
        ViewLoader.showWebview(context);
      }),
      activityBarTreeView
    );
  } catch (e) {
    console.error("activate failed", e);
  }
}

export function deactivate() {
}
