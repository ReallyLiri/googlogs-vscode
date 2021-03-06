import { FetchOptionsMessage, FetchPageMessage, FetchProjectsMessage, LoadMessage, Message, MessageAck, OptionsResultMessage, PageResultMessage, ProjectsResultMessage, SaveAsMessage } from "../common/message";
import { MessageType } from "../common/messageType";
import { MOCK_LOGS, MOCK_PROJECTS, MOCK_WEB_URL } from "./mock";
import { getDefaultOptions, Options } from "./options";

const sleep = (seconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, Math.ceil(seconds * 1000)));
};

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
    };

    window.addEventListener('message', listener);
    vscode.postMessage(message);
  });
}

export const fetchProjectsAsync = async (): Promise<ProjectsResultMessage> => {
  if (isBrowserDebug) {
    await sleep(1);
    return {type: MessageType.PROJECTS_RESULT, projects: MOCK_PROJECTS};
  }
  return await fetchDataAsync<FetchProjectsMessage, ProjectsResultMessage>(
    {type: MessageType.FETCH_PROJECTS},
    MessageType.PROJECTS_RESULT
  );
};

export const fetchPageAsync = async (message: FetchPageMessage): Promise<PageResultMessage> => {
  if (isBrowserDebug) {
    await sleep(2);
    return {type: MessageType.PAGE_RESULT, nextPageToken: "token", entries: MOCK_LOGS, webUrl: MOCK_WEB_URL};
  }
  return await fetchDataAsync<FetchPageMessage, PageResultMessage>(
    message,
    MessageType.PAGE_RESULT
  );
};

export const fetchOptionsAsync = async (): Promise<OptionsResultMessage> => {
  if (isBrowserDebug) {
    return {type: MessageType.OPTIONS_RESULT, options: getDefaultOptions("")};
  }
  return await fetchDataAsync<FetchOptionsMessage, OptionsResultMessage>(
    {type: MessageType.FETCH_OPTIONS},
    MessageType.OPTIONS_RESULT
  );
};

export const postOptionsAsync = async (options: Options): Promise<void> => {
  if (isBrowserDebug) {
    return;
  }
  await fetchDataAsync<OptionsResultMessage, MessageAck>(
    {type: MessageType.OPTIONS_RESULT, options},
    MessageType.ACK
  );
};

export const saveAsAsync = async (options: Options): Promise<void> => {
  if (isBrowserDebug) {
    return;
  }
  await fetchDataAsync<SaveAsMessage, MessageAck>(
    {type: MessageType.SAVE_AS, options},
    MessageType.ACK
  );
};

export const loadAsync = async (): Promise<OptionsResultMessage> => {
  if (isBrowserDebug) {
    return {type: MessageType.OPTIONS_RESULT, options: null};
  }
  return await fetchDataAsync<LoadMessage, OptionsResultMessage>(
    {type: MessageType.LOAD},
    MessageType.OPTIONS_RESULT
  );
};
