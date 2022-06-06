import { GoogleProject } from "../../app/common/googleProject";
import { google } from "@google-cloud/resource-manager/build/protos/protos";
import { GetEntriesRequest } from "@google-cloud/logging/build/src/log";
import { httpAsync } from "./client";
import ListProjectsResponse = google.cloud.resourcemanager.v3.ListProjectsResponse;

export async function getProjectsAsync(): Promise<GoogleProject[]> {
  try {
    const projectsResponse = await httpAsync<GetEntriesRequest, ListProjectsResponse>(
      'https://cloudresourcemanager.googleapis.com/v1/projects?alt=json&filter=lifecycleState%3AACTIVE',
      'get'
    );

    if (projectsResponse) {
      return projectsResponse.projects.map(project => ({
        id: project.projectId!,
        name: project.name!
      }));
    }
  } catch (e) {
    console.error("failed fetching logs", e);
  }
  return [];
}
