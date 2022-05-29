import { FetchPageMessage, FetchProjectsMessage, Message, MessageType, PageResultMessage, ProjectsResultMessage } from "../common/message";

async function fetchDataAsync<TInMessage extends Message, TOutMessage extends Message>(
  message: TInMessage,
  resultMessageType: MessageType
): Promise<TOutMessage> {
  console.log("fetchData", message);
  return new Promise((resolve, reject) => {

    const listener: EventListener = event => {
      try {
        const fetchResult = (event as any).data as TOutMessage;
        console.log("fetchResult", fetchResult);
        resolve(fetchResult);
      } catch (e) {
        console.error("fetch failed", e);
        reject(e);
      } finally {
        window.removeEventListener(resultMessageType, listener);
      }
    }

    window.addEventListener(resultMessageType, listener);
    vscode.postMessage(message);
  });
}

export const fetchProjectsAsync = async () => await fetchDataAsync<FetchProjectsMessage, ProjectsResultMessage>(
  {type: MessageType.FETCH_PROJECTS},
  MessageType.PROJECTS_RESULT
);

export const fetchPageAsync = async (message: FetchPageMessage) => await fetchDataAsync<FetchPageMessage, PageResultMessage>(
  message,
  MessageType.PAGE_RESULT
);
