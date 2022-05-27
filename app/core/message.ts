import { FetchPageMessage, MessageType, PageResultMessage } from "../common/message";

type Resolve = (value: (PromiseLike<PageResultMessage> | PageResultMessage)) => void;

let currentResolve: Resolve | null = null;

window.addEventListener(MessageType.PAGE_RESULT, event => {
  const pageResult = (event as any).data as PageResultMessage;
  console.log("pageResult", pageResult);
  if (currentResolve === null) {
    console.error("received event without resolve to accept it");
    return;
  }
  currentResolve(pageResult);
  currentResolve = null;
});

export function fetchPageAsync(message: FetchPageMessage): Promise<PageResultMessage> {
  console.log("fetchPage", message);
  vscode.postMessage(message);
  return new Promise((resolve: Resolve, reject) => {
    if (currentResolve !== null) {
      reject("page fetch already in progress");
    }
    currentResolve = resolve;
  });
}
