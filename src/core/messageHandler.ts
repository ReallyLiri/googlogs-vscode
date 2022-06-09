import { FetchPageMessage, Message, OptionsResultMessage, ProjectsResultMessage, SaveAsMessage } from "../../app/common/message";
import * as vscode from 'vscode';
import { LocalStorageService } from "./persist";
import { MessageType } from "../../app/common/messageType";
import { readLogsPageAsync } from "./loggingClient";
import { getProjectsAsync } from "./projectsClient";
import { getDefaultOptions } from "../../app/data/options";
import { loadAsync, saveAsAsync } from "./saveAs";

const OPTIONS_KEY = "options.v1";

async function fetchAndPostDataAsync<TOut extends Message>(panel: vscode.WebviewPanel, fetcher: (() => Promise<TOut>)) {
  const result = await fetcher();
  panel.webview.postMessage(result);
}

export async function handleMessage(panel: vscode.WebviewPanel, message: Message, storage: LocalStorageService) {
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
        return {type: MessageType.ACK};
      });
      break;
    case MessageType.SAVE_AS:
      await fetchAndPostDataAsync(panel, async () => {
        await saveAsAsync((message as SaveAsMessage).options);
        return {type: MessageType.ACK};
      });
      break;
    case MessageType.LOAD:
      await fetchAndPostDataAsync(panel, async () => {
        const options = await loadAsync();
        return {type: MessageType.OPTIONS_RESULT, options};
      });
      break;
    default:
      console.error("unexpected message type", message);
  }
}
