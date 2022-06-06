import { getAuthTokenAsync } from "./auth";
import { FetchPageMessage, PageResultMessage } from "../../app/common/message";
import { Duration, DurationUnits, LogFilter } from "../../app/common/filter";
import * as moment from "moment";
import { MessageType } from "../../app/common/messageType";
import { GetEntriesRequest } from "@google-cloud/logging/build/src/log";
import axios, { AxiosRequestConfig } from "axios";
import { constants as httpConstants } from "http2";
import { google } from "@google-cloud/logging/build/protos/protos";
import IListLogEntriesResponse = google.logging.v2.IListLogEntriesResponse;
import { httpAsync } from "./client";

function orValues(fieldName: string, values: string[]): string {
  return values.map(value => `${ fieldName }="${ value }"`).join(" OR ");
}

function durationAgoToTimestamp(duration: Duration) {
  const now = moment.utc();
  const momentDuration = moment.duration(duration.value, duration.unit as any);
  const target = now.subtract(momentDuration);
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
  if (fromAgo && fromAgo.unit !== DurationUnits.none) {
    parts.push(`timestamp>="${ durationAgoToTimestamp(fromAgo) }"`);
  }
  if (untilAgo && untilAgo.unit !== DurationUnits.none) {
    parts.push(`timestamp<="${ durationAgoToTimestamp(untilAgo) }"`);
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
    const entriesResponse = await httpAsync<GetEntriesRequest, IListLogEntriesResponse>(
      'https://logging.googleapis.com/v2/entries:list?alt=json',
      'post',
      requestBody
    );

    if (entriesResponse) {
      result.entries = entriesResponse.entries || [];
      result.nextPageToken = result.entries.length === 0 ? null : entriesResponse.nextPageToken || null;
    }
  } catch (e) {
    console.error("failed fetching logs", e);
  }
  return result;
}
