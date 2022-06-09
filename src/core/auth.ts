import { execAsync } from "./exec";
import * as vscode from "vscode";
import { isNotAuthenticated } from "./errors";

let authToken: string | undefined;

export function resetToken() {
  authToken = undefined;
}

export async function getAuthTokenAsync(isRetry = false): Promise<string> {
  try {
    if (!authToken) {
      authToken = await execAsync("gcloud auth print-access-token");
    }
    return authToken;
  } catch (e) {
    if (!isRetry && isNotAuthenticated(e as Error)) {
      vscode.window.showInformationMessage("You need to authenticate with Google Cloud Platform to use this extension.");
      await execAsync("gcloud auth login", 20);
      vscode.window.showInformationMessage("Successfully logged-in");
      return await getAuthTokenAsync(true);
    }
    throw e;
  }
}