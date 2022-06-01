import { FetchPageMessage, FetchProjectsMessage, Message, PageResultMessage, ProjectsResultMessage } from "../common/message";
import { MessageType } from "../common/messageType";
import { MOCK_LOGS, MOCK_PROJECTS } from "./mock";

const resolved = <T, >(value: T): Promise<T> => new Promise(resolve => resolve(value));

export const isBrowserDebug = window.self === window.top;

async function fetchDataAsync<TInMessage extends Message, TOutMessage extends Message>(
  message: TInMessage,
  resultMessageType: MessageType
): Promise<TOutMessage> {
  console.log("fetchData", message);
  return new Promise((resolve, reject) => {

    const listener: EventListener = event => {
      try {
        const fetchResult = (event as any).data as TOutMessage;
        if (!fetchResult || fetchResult.type !== resultMessageType) {
          return;
        }
        console.log("fetchResult", fetchResult);
        resolve(fetchResult);
        window.removeEventListener('message', listener);
      } catch (e) {
        console.error("fetch failed", e);
        reject(e);
        window.removeEventListener('message', listener);
      }
    }

    window.addEventListener('message', listener);
    vscode.postMessage(message);
  });
}

export const fetchProjectsAsync = async (): Promise<ProjectsResultMessage> => isBrowserDebug
  ? {type: MessageType.PROJECTS_RESULT, projects: MOCK_PROJECTS}
  : await fetchDataAsync<FetchProjectsMessage, ProjectsResultMessage>(
    {type: MessageType.FETCH_PROJECTS},
    MessageType.PROJECTS_RESULT
  );

export const fetchPageAsync = async (message: FetchPageMessage): Promise<PageResultMessage> => isBrowserDebug
  ? {type: MessageType.PAGE_RESULT, nextPageToken: "token", entries: MOCK_LOGS}
  : await fetchDataAsync<FetchPageMessage, PageResultMessage>(
    message,
    MessageType.PAGE_RESULT
  );
