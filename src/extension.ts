import * as vscode from 'vscode';
import { ViewLoader } from './view/ViewLoader';
import { CommonMessage } from './view/messages/messageTypes';
import { readLogsAsync } from "./view/core/gcloudLogging";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('webview.open', () => {
      ViewLoader.showWebview(context);
    }),

    vscode.commands.registerCommand('extension.sendMessage', () => {
      vscode.window
        .showInputBox({
          prompt: 'Send message to Webview',
        })
        .then(result => {
          result &&
            ViewLoader.postMessageToWebview<CommonMessage>({
              type: 'COMMON',
              payload: result,
            });
        });
    })
  );


  readLogsAsync();
}

export function deactivate() {}
