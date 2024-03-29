import { FetchPageMessage, PageResultMessage } from "../../app/common/message";
import { Duration, DurationUnits, LogFilter } from "../../app/common/filter";
import * as moment from "moment";
import { MessageType } from "../../app/common/messageType";
import { GetEntriesRequest } from "@google-cloud/logging/build/src/log";
import { google } from "@google-cloud/logging/build/protos/protos";
import { httpAsync } from "./client";
import IListLogEntriesResponse = google.logging.v2.IListLogEntriesResponse;

function orValues(fieldName: string, values: string[]): string {
  return "(" + values.map(value => `${ fieldName }="${ value }"`).join(" OR ") + ")";
}

function durationAgoToTimestamp(duration: Duration) {
  const now = moment.utc();
  const momentDuration = moment.duration(duration.value, duration.unit as any);
  const target = now.subtract(momentDuration);
  return target.format();
}

function buildFilterText(filter: LogFilter): string {
  const parts = [];
  const {resourceType, text, containerNames, namespaces, severities, fromAgo, untilAgo} = filter;
  if (resourceType) {
    parts.push(`resource.type="${ resourceType }"`);
  }
  if (text) {
    parts.push(text);
  }
  if (containerNames && containerNames.length > 0) {
    parts.push(orValues("resource.labels.container_name", containerNames));
  }
  if (namespaces && namespaces.length > 0) {
    parts.push(orValues("resource.labels.namespace_name", namespaces));
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

const escapeQuery = (query: string) =>
  encodeURIComponent(query)
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29");

const toWebUrl = (projectId: string, query: string) =>
  `https://console.cloud.google.com/logs/query;query=${ escapeQuery(query) };?project=${ projectId }`;

let firstPageRequest: GetEntriesRequest | null = null;

function buildRequest(fetchPage: FetchPageMessage): GetEntriesRequest | null {
  if (fetchPage.pageToken) {
    if (!firstPageRequest) {
      console.error("Non first page requests must have a page token");
      return null;
    }
    return {...firstPageRequest, pageToken: fetchPage.pageToken};
  }
  const request = {
    filter: buildFilterText(fetchPage.filter),
    resourceNames: [`projects/${ fetchPage.filter.projectId! }`],
    orderBy: "timestamp desc",
    pageSize: fetchPage.pageSize,
  };
  firstPageRequest = request;
  return request;
}

export async function readLogsPageAsync(fetchPage: FetchPageMessage): Promise<PageResultMessage> {
  const result: PageResultMessage = {type: MessageType.PAGE_RESULT, entries: [], nextPageToken: null, webUrl: ""};
  try {
    const request = await buildRequest(fetchPage);
    if (request) {
      result.webUrl = toWebUrl(fetchPage.filter.projectId!, request.filter!);
      const entriesResponse = await httpAsync<GetEntriesRequest, IListLogEntriesResponse>(
        'https://logging.googleapis.com/v2/entries:list?alt=json',
        'post',
        request
      );

      if (entriesResponse) {
        result.entries = entriesResponse.entries || [];
        result.nextPageToken = result.entries.length === 0 ? null : entriesResponse.nextPageToken || null;
      }
    }
  } catch (e) {
    console.error("failed fetching logs", e);
  }
  console.log(`fetched ${ result.entries.length } entries. hasNext? ${ result.nextPageToken !== null }. webUrl: ${ result.webUrl }`);
  return result;
}
