import * as vscode from 'vscode';
import * as path from 'path';
import { FetchPageMessage, Message, OptionsResultMessage, ProjectsResultMessage } from '../app/common/message';
import { readLogsPageAsync } from "./core/loggingClient";
import { getProjectsAsync } from "./core/projectsClient";
import { MessageType } from "../app/common/messageType";
import { LocalStorageService } from "./core/persist";
import { getDefaultOptions } from "../app/data/options";

const OPTIONS_KEY = "options.v1";

async function fetchAndPostDataAsync<TOut extends Message>(panel: vscode.WebviewPanel, fetcher: (() => Promise<TOut>)) {
  const result = await fetcher();
  panel.webview.postMessage(result);
}

async function handleMessage(panel: vscode.WebviewPanel, message: Message, storage: LocalStorageService) {
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
    case MessageType.FETCH_OPTIONS:
      await fetchAndPostDataAsync(panel, async () => ({
        type: MessageType.OPTIONS_RESULT,
        options: await storage.getValue(OPTIONS_KEY) || getDefaultOptions("")
      }));
      break;
    case MessageType.OPTIONS_RESULT:
      await fetchAndPostDataAsync(panel, async () => {
        await storage.setValue(OPTIONS_KEY, (message as OptionsResultMessage).options);
        return { type: MessageType.ACK };
      });
      break;
    default:
      console.error("unexpected message type", message);
  }
}

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
      localResourceRoots: [vscode.Uri.file(path.join(this.context.extensionPath, 'out', 'app'))],
    };

    this.panel = vscode.window.createWebviewPanel('googelogs', 'Google Logs', vscode.ViewColumn.One, options);

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
        <body style="background-color: #212121; color: #d4d4d4; font-size: 13px; overflow-y: hidden; font-family: Menlo,Monaco,monospace">
          <div id="root"></div>
          <script>
            const vscode = acquireVsCodeApi();
          </script>
          <script src="${bundleScriptPath}"></script>
        </body>
      </html>
    `;
  }
}
