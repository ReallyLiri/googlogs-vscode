import * as moment from "moment";
import { COLOR_DEBUG, COLOR_ERROR, COLOR_INFO, COLOR_WARNING } from "../style";

export enum LogSeverity {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR"
}

export const SeverityToColor: Record<LogSeverity, string> = {
  DEBUG: COLOR_DEBUG,
  ERROR: COLOR_ERROR,
  INFO: COLOR_INFO,
  WARNING: COLOR_WARNING
};

export type LogFilter = {
  projectId?: string,
  containerNames?: string[],
  text?: string,
  severities?: LogSeverity[],
  untilAgo?: moment.Duration,
  fromAgo?: moment.Duration
};
