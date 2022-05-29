type Message = import('./common/message').Message;
type State = import('./data/options').Options;

type VSCode = {
  postMessage<T extends Message = Message>(message: T): void;
  getState(): State | undefined;
  setState(state: State): void;
};

declare const vscode: VSCode;
