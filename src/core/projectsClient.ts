import { GoogleProject } from "../../app/common/googleProject";
import { execAsync } from "./exec";
import * as protos from "@google-cloud/resource-manager/build/protos/protos";

export async function getProjectsAsync(): Promise<GoogleProject[]> {
  try {
    const json: string = await execAsync("gcloud projects list --format=json");
    const googleProjects = JSON.parse(json) as protos.google.cloud.resourcemanager.v3.IProject[];
    return googleProjects.map(project => ({id: project.projectId!, name: project.name!}));
  } catch (e) {
    console.error("failed fetching projects", e);
    return [];
  }
}
