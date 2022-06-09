import { GoogleProject } from "../../app/common/googleProject";
import { google } from "@google-cloud/resource-manager/build/protos/protos";
import { GetEntriesRequest } from "@google-cloud/logging/build/src/log";
import { httpAsync } from "./client";
import { isAuthFailed, isCommandNotFound } from "./errors";
import ListProjectsResponse = google.cloud.resourcemanager.v3.ListProjectsResponse;

export async function getProjectsAsync(): Promise<{
  projects: GoogleProject[], commandMissing?: boolean, authFailed?: boolean
}> {
  try {
    const projectsResponse = await httpAsync<GetEntriesRequest, ListProjectsResponse>(
      'https://cloudresourcemanager.googleapis.com/v1/projects?alt=json&filter=lifecycleState%3AACTIVE',
      'get'
    );

    if (projectsResponse) {
      return {
        projects: projectsResponse.projects.map(project => ({
          id: project.projectId!,
          name: project.name!
        }))
      };
    }
  } catch (e) {
    if (isCommandNotFound(e as Error)) {
      return {projects: [], commandMissing: true};
    }
    if (isAuthFailed(e as Error)) {
      return {projects: [], authFailed: true};
    }
    console.error("failed fetching projects", e);
  }
  return {projects: []};
}
