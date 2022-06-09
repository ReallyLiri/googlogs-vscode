import * as vscode from 'vscode';
import * as path from 'path';
import { LocalStorageService } from "./core/persist";
import { handleMessage } from "./core/messageHandler";

export class ViewLoader {
  public static currentPanel?: vscode.WebviewPanel;

  private readonly context: vscode.ExtensionContext;
  private readonly panel: vscode.WebviewPanel;
  private readonly disposables: vscode.Disposable[];
  private readonly storage: LocalStorageService;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.disposables = [];
    this.storage = new LocalStorageService(context.workspaceState);

    const options = {
      enableScripts: true,
      retainContextWhenHidden: true,
      enableFindWidget: true,
      localResourceRoots: [vscode.Uri.file(path.join(this.context.extensionPath, 'out'))],
    };

    this.panel = vscode.window.createWebviewPanel('googlogs', 'Google Logs', vscode.ViewColumn.One, options);

    this.renderWebview();

    this.panel.webview.onDidReceiveMessage(
      message => handleMessage(this.panel, message, this.storage),
      null,
      this.disposables
    );

    this.panel.onDidDispose(
      () => {
        this.dispose();
      },
      null,
      this.disposables
    );
  }

  private renderWebview() {
    this.panel.webview.html = this.render();
  }

  static showWebview(context: vscode.ExtensionContext) {
    const cls = this;
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;
    if (cls.currentPanel) {
      cls.currentPanel.reveal(column);
    } else {
      cls.currentPanel = new cls(context).panel;
    }
  }

  public dispose() {
    ViewLoader.currentPanel = undefined;

    this.panel.dispose();

    while (this.disposables.length) {
      this.disposables.pop()?.dispose();
    }
  }

  render() {
    const bundleScriptPath = this.panel.webview.asWebviewUri(
      vscode.Uri.file(path.join(this.context.extensionPath, 'out', 'app.js'))
    );

    return `
      <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Googlogs</title>
        </head>
        <body style="background-color: #212121; color: #d4d4d4; font-size: 13px; overflow-y: hidden; font-family: Menlo,Monaco,monospace">
          <div id="root"></div>
          <script>
            const vscode = acquireVsCodeApi();
          </script>
          <script src="${ bundleScriptPath }"></script>
        </body>
      </html>
    `;
  }
}
