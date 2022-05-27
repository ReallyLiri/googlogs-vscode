import * as vscode from 'vscode';
import * as path from 'path';
import { getAPIUserGender } from '../config';
import { FetchPageMessage, Message, MessageType } from '../../app/common/message';
import { readLogsPageAsync } from "./core/loggingClient";
import { getProjectsAsync } from "./core/projectsClient";

export class ViewLoader {
  public static currentPanel?: vscode.WebviewPanel;

  private panel: vscode.WebviewPanel;
  private context: vscode.ExtensionContext;
  private readonly disposables: vscode.Disposable[];

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.disposables = [];

    this.panel = vscode.window.createWebviewPanel('reactApp', 'React App', vscode.ViewColumn.One, {
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [vscode.Uri.file(path.join(this.context.extensionPath, 'out', 'app'))],
    });

    this.renderWebview();

    this.panel.webview.onDidReceiveMessage(
      async (message: Message) => {
        switch (message.type) {
          case MessageType.FETCH_PAGE:
            const pageResultMessage = await readLogsPageAsync(message as FetchPageMessage);
            this.panel.webview.postMessage(pageResultMessage);
            break;
          default:
            console.error("unexpected message type", message);
        }
      },
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

    getProjectsAsync().then(projects => {
      this.panel.webview.postMessage({type: MessageType.PROJECTS_LIST, projects})
    });
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

  static postMessageToWebview<T extends Message = Message>(message: T) {
    this.currentPanel?.webview.postMessage(message);
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
      vscode.Uri.file(path.join(this.context.extensionPath, 'out', 'app', 'bundle.js'))
    );

    const gender = getAPIUserGender();

    return `
      <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Googelogs</title>
        </head>
        <body>
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
