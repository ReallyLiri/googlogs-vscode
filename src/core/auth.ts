import { execAsync } from "./exec";

let authToken: string | undefined;

export async function getAuthTokenAsync(): Promise<string> {
  if (!authToken) {
    authToken = await execAsync("gcloud auth print-access-token");
  }
  return authToken;
}