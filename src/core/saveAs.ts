import { Options } from "../../app/data/options";
import * as vscode from "vscode";
import { promises } from "fs";

export async function saveAsAsync(options: Options) {
  try {
    const uri = await vscode.window.showSaveDialog({
      saveLabel: "Save as...",
      title: "Save search as",
      filters: {'Json': ['json']},
      defaultUri: vscode.Uri.file(`logs_${ options.filter.projectId }.json`)
    });
    if (!uri) {
      return;
    }
    const filePath = uri.fsPath;
    console.log("saving as", filePath);
    const r = await promises.writeFile(filePath, JSON.stringify(options, null, 2));
    vscode.window.showInformationMessage(`Search options saved successfully at ${ filePath }`);
  } catch (e) {
    console.error("save failed", e);
  }
}

export async function loadAsync(): Promise<Options | null> {
  try {
    const uris = await vscode.window.showOpenDialog({
      openLabel: "Open...",
      title: "Load search",
      filters: {'Json': ['json']},
      canSelectFolders: false,
      canSelectFiles: true,
      canSelectMany: false
    });
    if (!uris || uris.length === 0) {
      return null;
    }
    const filePath = uris[0].fsPath;
    console.log("loading", filePath);
    const options = JSON.parse(await promises.readFile(filePath, "utf8"));
    console.log("loaded options", filePath, options);
    vscode.window.showInformationMessage(`Search options loaded successfully from ${ filePath }`);
    return options;
  } catch (e) {
    console.error("load failed", e);
    return null;
  }
}