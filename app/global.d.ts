type Message = import('./common/message').Message;

type VSCode = {
  postMessage<T extends Message = Message>(message: T): void;
};

declare const vscode: VSCode;
