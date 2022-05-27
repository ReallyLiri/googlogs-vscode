import { LogFilter } from "./filter";
import { Entry } from "@google-cloud/logging";
import { Project } from "./project";

export enum MessageType {
  FETCH_PAGE = 'FETCH_PAGE',
  PAGE_RESULT = 'PAGE_RESULT',
  PROJECTS_LIST = 'PROJECTS_LIST'
}

export interface Message {
  type: MessageType;
}

export interface FetchPageMessage extends Message {
  type: MessageType.FETCH_PAGE;
  filter: LogFilter;
  pageSize: number;
  pageToken: string | undefined;
}

export interface PageResultMessage extends Message {
  type: MessageType.PAGE_RESULT;
  entries: Entry[];
  nextPageToken: string | null;
}

export interface ProjectsListMessage extends Message {
  type: MessageType.PROJECTS_LIST,
  projects: Project[]
}
