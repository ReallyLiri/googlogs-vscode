type Message = import('./common/message').Message;
type State = import('./core/state').State;

type VSCode = {
  postMessage<T extends Message = Message>(message: T): void;
  getState(): State | undefined;
  setState(state: State): void;
};

declare const vscode: VSCode;
