import { GetEntriesResponse, Logging } from "@google-cloud/logging";
import { getAuthAsync } from "./auth";
import { FetchPageMessage, MessageType, PageResultMessage } from "../../app/common/message";
import { LogFilter } from "../../app/common/filter";
import * as moment from "moment";

let _logging: Logging | undefined;

async function getLoggingAsync(): Promise<Logging> {
  if (_logging) {
    return _logging;
  }
  _logging = new Logging({auth: await getAuthAsync()});
  return _logging;
}

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
  try {
    const logging = await getLoggingAsync();
    const [entries, _, response]: GetEntriesResponse = await logging.getEntries({
      filter: buildFilterText(request.filter),
      resourceNames: `projects/${ request.filter.projectId }`,
      orderBy: "timestamp desc",
      autoPaginate: false,
      pageSize: request.pageSize,
      pageToken: request.pageToken ?? undefined,
    });
    return {type: MessageType.PAGE_RESULT, entries, nextPageToken: response.nextPageToken || null};
  } catch (e) {
    console.error("failed fetching logs", e);
    return {type: MessageType.PAGE_RESULT, entries: [], nextPageToken: null};
  }
}
