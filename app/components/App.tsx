import React, { useCallback, useEffect, useState } from 'react';
import { GoogleProject } from "../common/googleProject";
import { getDefaultOptions, Options } from "../data/options";
import { fetchPageAsync, fetchProjectsAsync, isBrowserDebug } from "../data/fetchData";
import { MessageType } from "../common/messageType";
import { google } from "@google-cloud/logging/build/protos/protos";
import { LogsTable } from "./LogsTable";
import PageLoading from "./Loader";
import OptionsPane from "./OptionsPane";
import styled from "styled-components";
import ILogEntry = google.logging.v2.ILogEntry;
import Loader from "./Loader";

const StyledOptionsPane = styled(OptionsPane)`
  margin: 8px 0 8px 8px;
`;

const StyledLogsTable = styled(LogsTable)`
  margin: 8px 0 8px 8px;
`;

export const App = () => {
  const [options, setOptions] = isBrowserDebug
    // eslint-disable-next-line react-hooks/rules-of-hooks
    ? useState<Options>(getDefaultOptions(""))
    : [vscode.getState() || getDefaultOptions(""), vscode.setState];
  const [entries, setEntries] = useState<ILogEntry[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>();
  const [projects, setProjects] = useState<GoogleProject[]>();
  const projectIsSelected = options.filter.projectId.length > 0;
  const [showEntries, setShowEntries] = useState(projectIsSelected);

  const setPartialOptions = useCallback((newOptions: Partial<Options>) => {
    console.log("setting partial options", newOptions);
    setOptions({...options, ...newOptions, filter: {...options.filter, ...newOptions.filter}});
  }, [options, setOptions]);

  useEffect(() => {
    if (projects !== undefined) {
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
      })
      .catch(error => console.error(error));
  }, [projectIsSelected, projects, setProjects]);

  const fetchPageCallback = useCallback(async () => {
    const result = await fetchPageAsync({
      type: MessageType.FETCH_PAGE,
      pageToken: nextPageToken || null,
      ...options
    });
    setNextPageToken(result.nextPageToken);
    setEntries(currentEntries => [...currentEntries, ...result.entries]);
  }, [options, nextPageToken]);

  const resetEntries = useCallback(() => {
    console.log("resetting entries...");
    setEntries([]);
    setNextPageToken(undefined);
    if (projectIsSelected) {
      console.log("making call for first page");
      // noinspection JSIgnoredPromiseFromCall
      fetchPageCallback();
      setShowEntries(true);
    }
  }, [projectIsSelected, setEntries, setNextPageToken, fetchPageCallback]);

  useEffect(() => {
    if (projectIsSelected) {
      console.log("fetching first time data");
      resetEntries();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {
        !projects && <Loader type="Audio" title="Loading..." floating size={100}/>
      }
      {
        projects && <StyledOptionsPane
              options={ options }
              projects={ projects }
              setSelectedProject={ projectId => setPartialOptions({filter: {projectId: projectId ?? ""}}) }
              apply={ () => resetEntries() }
          />
      }
      {
        projects && showEntries && <StyledLogsTable
              entries={ entries }
              fetchNext={ fetchPageCallback }
              hasMore={ nextPageToken !== null }
          />
      }
    </>
  );
};
