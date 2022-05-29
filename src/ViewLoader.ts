import * as vscode from 'vscode';
import * as path from 'path';
import { FetchPageMessage, Message, ProjectsResultMessage } from '../app/common/message';
import { readLogsPageAsync } from "./core/loggingClient";
import { getProjectsAsync } from "./core/projectsClient";
import { MessageType } from "../app/common/messageType";

async function fetchAndPostDataAsync<TOut extends Message>(panel: vscode.WebviewPanel, fetcher: (() => Promise<TOut>)) {
  const result = await fetcher();
  panel.webview.postMessage(result);
}

async function handleMessage(panel: vscode.WebviewPanel, message: Message) {
  switch (message.type) {
    case MessageType.FETCH_PAGE:
      await fetchAndPostDataAsync(panel, () => readLogsPageAsync(message as FetchPageMessage));
      break;
    case MessageType.FETCH_PROJECTS:
      await fetchAndPostDataAsync<ProjectsResultMessage>(panel, async () => ({
        type: MessageType.PROJECTS_RESULT,
        projects: await getProjectsAsync()
      }));
      break;
    default:
      console.error("unexpected message type", message);
  }
}

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
      message => handleMessage(this.panel, message),
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
