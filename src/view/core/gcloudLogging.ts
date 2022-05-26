import { GetEntriesResponse, Logging } from "@google-cloud/logging";
import { GoogleAuth } from "google-auth-library/build/src/auth/googleauth";
import { exec } from 'child_process';

const promisify = require('util.promisify');
const execAsync = promisify(exec);

let _logging: Logging | undefined;

async function getLoggingAsync(): Promise<Logging> {
  if (_logging) {
    return _logging;
  }

  const token: string = (await execAsync("gcloud auth print-access-token")).stdout.trim();

  const auth = new GoogleAuth({scopes: 'https://www.googleapis.com/auth/cloud-platform'});
  const client = await auth.getClient();
  client.setCredentials({
    token_type: "Bearer",
    access_token: token
  });
  _logging = new Logging({auth});
  return _logging;
}

export async function readLogsAsync() {
  const logging = await getLoggingAsync();
  const [entries, _, response]: GetEntriesResponse = await logging.getEntries({
    filter: 'resource.type="k8s_container"',
    resourceNames: 'projects/akooda-stage',
    autoPaginate: false,
    pageSize: 5,
    orderBy: "timestamp desc"
  });
  console.log(entries.length, response.nextPageToken)
}
