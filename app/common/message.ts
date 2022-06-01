import { LogFilter } from "./filter";
import { GoogleProject } from "./googleProject";
import { MessageType } from "./messageType";
import { google } from "@google-cloud/logging/build/protos/protos";
import { Options } from "../data/options";
import ILogEntry = google.logging.v2.ILogEntry;

export interface Message {
  type: MessageType;
}

export interface MessageAck extends Message {
  type: MessageType.ACK
}

export interface FetchOptionsMessage extends Message {
  type: MessageType.FETCH_OPTIONS
}

export interface OptionsResultMessage extends Message {
  type: MessageType.OPTIONS_RESULT,
  options: Options
}

export interface FetchPageMessage extends Message {
  type: MessageType.FETCH_PAGE;
  filter: LogFilter;
  pageSize: number;
  pageToken: string | null;
}

export interface PageResultMessage extends Message {
  type: MessageType.PAGE_RESULT;
  entries: ILogEntry[];
  nextPageToken: string | null;
}

export interface FetchProjectsMessage extends Message {
  type: MessageType.FETCH_PROJECTS
}

export interface ProjectsResultMessage extends Message {
  type: MessageType.PROJECTS_RESULT,
  projects: GoogleProject[]
}
