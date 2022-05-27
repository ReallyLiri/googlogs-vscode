import { GoogleAuth } from "google-auth-library/build/src/auth/googleauth";
import { execAsync } from "./exec";

let auth: GoogleAuth | undefined;

export async function getAuthAsync(): Promise<GoogleAuth> {
  if (auth) {
    return auth;
  }

  const token: string = await execAsync("gcloud auth print-access-token");

  auth = new GoogleAuth({scopes: 'https://www.googleapis.com/auth/cloud-platform'});
  const client = await auth.getClient();
  client.setCredentials({
    token_type: "Bearer",
    access_token: token
  });
  return auth;
}