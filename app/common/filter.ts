import * as moment from "moment";

export enum LogSeverity {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR"
}

export type LogFilter = {
  projectId: string,
  containerNames?: string[],
  text?: string,
  severities?: LogSeverity[],
  untilAgo?: moment.Duration,
  fromAgo?: moment.Duration
}
