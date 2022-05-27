import { getAuthAsync } from "./auth";
import { ProjectsClient } from "@google-cloud/resource-manager";
import { Project } from "../../../app/common/project";

let _projects: ProjectsClient | undefined;

async function getProjectsClientAsync(): Promise<ProjectsClient> {
  if (_projects) {
    return _projects;
  }
  // @ts-ignore
  _projects = new ProjectsClient({auth: await getAuthAsync()});
  return _projects;
}

export async function getProjectsAsync(): Promise<Project[]> {
  try {
    const projects: Project[] = [];
    for await (const project of (await getProjectsClientAsync()).listProjectsAsync()) {
      projects.push({id: project.projectId!, name: project.name!})
    }
    return projects;
  } catch (e) {
    console.error("failed fetching projects", e);
    return [];
  }
}
