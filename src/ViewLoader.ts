import * as vscode from 'vscode';
import * as path from 'path';
import { FetchPageMessage, Message, MessageType, ProjectsResultMessage } from '../app/common/message';
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

    const options = {
      enableScripts: true,
      retainContextWhenHidden: true,
      localResourceRoots: [vscode.Uri.file(path.join(this.context.extensionPath, 'out', 'app'))],
    };

    this.panel = vscode.window.createWebviewPanel('googelogs', 'Google Logs', vscode.ViewColumn.One, options);

    this.renderWebview();

    this.panel.webview.onDidReceiveMessage(
      this.onDidReceiveMessage,
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

  private async fetchAndPostDataAsync<TOut extends Message>(fetcher: (() => Promise<TOut>)) {
    const result = await fetcher();
    this.panel.webview.postMessage(result);
  }

  private async onDidReceiveMessage(message: Message) {
    switch (message.type) {
      case MessageType.FETCH_PAGE:
        await this.fetchAndPostDataAsync(() => readLogsPageAsync(message as FetchPageMessage));
        break;
      case MessageType.FETCH_PROJECTS:
        await this.fetchAndPostDataAsync<ProjectsResultMessage>(async () => ({
          type: MessageType.PROJECTS_RESULT,
          projects: await getProjectsAsync()
        }));
        break;
      default:
        console.error("unexpected message type", message);
    }
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
      vscode.Uri.file(path.join(this.context.extensionPath, 'out', 'app', 'bundle.js'))
    );

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
