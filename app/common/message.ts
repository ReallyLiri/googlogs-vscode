import { LogFilter } from "./filter";
import { GoogleProject } from "./googleProject";
import { MessageType } from "./messageType";
import { google } from "@google-cloud/logging/build/protos/protos";
import ILogEntry = google.logging.v2.ILogEntry;

export interface Message {
  type: MessageType;
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
