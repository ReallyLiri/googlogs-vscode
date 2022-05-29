import { LogFilter } from "./filter";
import { Entry } from "@google-cloud/logging";
import { GoogleProject } from "./googleProject";

export enum MessageType {
  FETCH_PAGE = 'FETCH_PAGE',
  PAGE_RESULT = 'PAGE_RESULT',
  FETCH_PROJECTS = 'FETCH_PROJECTS',
  PROJECTS_RESULT = 'PROJECTS_RESULT'
}

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
  entries: Entry[];
  nextPageToken: string | null;
}

export interface FetchProjectsMessage extends Message {
  type: MessageType.FETCH_PROJECTS
}

export interface ProjectsResultMessage extends Message {
  type: MessageType.PROJECTS_RESULT,
  projects: GoogleProject[]
}
