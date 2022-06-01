import React, { useCallback, useEffect, useState } from 'react';
import { GoogleProject } from "../common/googleProject";
import { getDefaultOptions, Options } from "../data/options";
import { fetchPageAsync, fetchProjectsAsync, isBrowserDebug } from "../data/fetchData";
import { MessageType } from "../common/messageType";
import { google } from "@google-cloud/logging/build/protos/protos";
import styled from "styled-components";
import { LogsTable } from "./LogsTable";
import ILogEntry = google.logging.v2.ILogEntry;



export const App = () => {
  const [options, setOptions] = isBrowserDebug
    // eslint-disable-next-line react-hooks/rules-of-hooks
    ? useState<Options>(getDefaultOptions(""))
    : [vscode.getState() || getDefaultOptions(""), vscode.setState];
  const [entries, setEntries] = useState<ILogEntry[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>();
  const [projects, setProjects] = useState<GoogleProject[]>([]);
  const projectIsSelected = options.filter.projectId.length > 0;

  const resetEntries = useCallback(() => {
    setEntries([]);
    setNextPageToken(undefined);
  }, [setEntries, setNextPageToken]);

  const setProject = useCallback((projectId: string) => {
    if (projectId === options.filter.projectId) {
      return;
    }
    setOptions({...options, filter: {...options.filter, projectId}});
    resetEntries();
  }, [options, setOptions, resetEntries]);

  useEffect(() => {
    if (projects.length > 0) {
      return;
    }
    fetchProjectsAsync()
      .then(projectsResult => {
        const googleProjects = projectsResult.projects;
        if (googleProjects.length === 0) {
          console.error("no projects were fetched");
          return;
        }
        setProjects(googleProjects);
        if (projectIsSelected) {
          setProject(googleProjects[0].id);
        }
      })
      .catch(error => console.error(error));
  }, [projectIsSelected, projects, setProject, setProjects]);

  const fetchPageCallback = useCallback(async () => {
    const result = await fetchPageAsync({
      type: MessageType.FETCH_PAGE,
      pageToken: nextPageToken || null,
      ...options
    });
    setNextPageToken(result.nextPageToken);
    setEntries(currentEntries => [...currentEntries, ...result.entries]);
  }, [options, nextPageToken]);

  useEffect(() => {
    if (projectIsSelected && nextPageToken === undefined) {
      // noinspection JSIgnoredPromiseFromCall
      fetchPageCallback();
    }
  }, [projectIsSelected, nextPageToken, fetchPageCallback]);

  return (
    <>
      <div>
        { projects.map(project => <div key={ project.id } onClick={ () => setProject(project.id) }>{ project.name }</div>) }
      </div>
      {
        projectIsSelected && <LogsTable
              entries={ entries }
              fetchNext={ fetchPageCallback }
              hasMore={ nextPageToken !== null }
          />
      }
    </>
  );
};
