import { COLOR_DEBUG, COLOR_ERROR, COLOR_INFO, COLOR_WARNING } from "../style";

export enum LogSeverity {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR"
}

export const SeverityToColor: Record<LogSeverity, string> = {
  [LogSeverity.DEBUG]: COLOR_DEBUG,
  [LogSeverity.ERROR]: COLOR_ERROR,
  [LogSeverity.INFO]: COLOR_INFO,
  [LogSeverity.WARNING]: COLOR_WARNING
};

export enum DurationUnits {
  none = "none",
  year = "year",
  month = "month",
  week = "week",
  day = "day",
  hour = "hour",
  minute = "minute"
}

export type Duration = {
  value: number,
  unit: DurationUnits,
};

export type LogFilter = {
  projectId?: string,
  containerNames?: string[],
  namespaces?: string[],
  text?: string,
  severities?: LogSeverity[],
  untilAgo?: Duration,
  fromAgo?: Duration
};
