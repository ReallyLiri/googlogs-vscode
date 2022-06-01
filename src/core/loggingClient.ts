import { getAuthTokenAsync } from "./auth";
import { FetchPageMessage, PageResultMessage } from "../../app/common/message";
import { LogFilter } from "../../app/common/filter";
import * as moment from "moment";
import { MessageType } from "../../app/common/messageType";
import { GetEntriesRequest } from "@google-cloud/logging/build/src/log";
import axios, { AxiosRequestConfig } from "axios";
import { constants as httpConstants } from "http2";
import { google } from "@google-cloud/logging/build/protos/protos";
import IListLogEntriesResponse = google.logging.v2.IListLogEntriesResponse;

function orValues(fieldName: string, values: string[]): string {
  return values.map(value => `${ fieldName }="${ value }"`).join(" OR ");
}

function durationAgoToTimestamp(duration: moment.Duration) {
  const now = moment.utc();
  const target = now.subtract(duration);
  return target.format();
}

function buildFilterText(filter: LogFilter): string {
  const parts = ['resource.type="k8s_container"'];
  const {text, containerNames, severities, fromAgo, untilAgo} = filter;
  if (text) {
    parts.push(text);
  }
  if (containerNames && containerNames.length > 0) {
    parts.push(orValues("resource.labels.container_name", containerNames));
  }
  if (severities && severities.length > 0) {
    parts.push(orValues("severity", severities));
  }
  if (fromAgo) {
    parts.push(`timestamp>="${ durationAgoToTimestamp(fromAgo) }"`)
  }
  if (untilAgo) {
    parts.push(`timestamp<="${ durationAgoToTimestamp(untilAgo) }"`)
  }
  return parts.join(" AND ");
}

export async function readLogsPageAsync(request: FetchPageMessage): Promise<PageResultMessage> {
  const result: PageResultMessage = {type: MessageType.PAGE_RESULT, entries: [], nextPageToken: null};
  try {
    const requestBody: GetEntriesRequest = {
      filter: buildFilterText(request.filter),
      resourceNames: [`projects/${ request.filter.projectId }`],
      orderBy: "timestamp desc",
      pageSize: request.pageSize,
      pageToken: request.pageToken ?? undefined,
    };
    const config: AxiosRequestConfig = {
      method: 'post',
      url: 'https://logging.googleapis.com/v2/entries:list?alt=json',
      headers: {
        'Authorization': `Bearer ${ await getAuthTokenAsync() }`,
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(requestBody)
    };

    const response = await axios.request(config);
    if (response.status !== httpConstants.HTTP_STATUS_OK) {
      console.error("failed fetching logs", response);
    } else {
      const entriesResponses = response.data as IListLogEntriesResponse;
      result.entries = entriesResponses.entries || [];
      result.nextPageToken = result.entries.length === 0 ? null : entriesResponses.nextPageToken || null;
    }
  } catch (e) {
    console.error("failed fetching logs", e);
  }
  return result;
}
