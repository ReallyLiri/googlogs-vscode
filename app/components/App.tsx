import React, { useCallback, useEffect, useState } from 'react';
import { GoogleProject } from "../common/googleProject";
import { getDefaultOptions, Options } from "../data/options";
import { fetchOptionsAsync, fetchPageAsync, fetchProjectsAsync, postOptionsAsync } from "../data/fetchData";
import { MessageType } from "../common/messageType";
import { google } from "@google-cloud/logging/build/protos/protos";
import { LogsTable } from "./LogsTable";
import Loader from "./Loader";
import OptionsPane from "./Options/OptionsPane";
import styled from "styled-components";
import { OptionsResultMessage, ProjectsResultMessage } from "../common/message";
import { Footer } from "./Footer";
import ILogEntry = google.logging.v2.ILogEntry;

const MARGIN = 8;

const StyledOptionsPane = styled(OptionsPane)`
  margin: ${ MARGIN }px;
`;

const StyledLogsTable = styled(LogsTable)`
  margin: ${ MARGIN }px;
`;

const StyledFooter = styled(Footer)`
  margin: ${ MARGIN }px;
`;

export const App = () => {
  const [options, setOptions] = useState<Options>(getDefaultOptions(""));
  const [entries, setEntries] = useState<ILogEntry[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>();
  const [projects, setProjects] = useState<GoogleProject[]>();
  const projectIsSelected = !!options.filter.projectId;
  const [showEntries, setShowEntries] = useState(projectIsSelected);
  const [shouldReset, setShouldReset] = useState<boolean>(false);
  const [webUrl, setWebUrl] = useState<string>();

  const setPartialOptions = useCallback((newOptions: Partial<Options>, persist: boolean = true) => {
    console.log("setting partial options", newOptions);
    const fullNewOptions: Options = {...options, ...newOptions, filter: {...options.filter, ...newOptions.filter}};
    setOptions(fullNewOptions);
    if (persist) {
      // noinspection JSIgnoredPromiseFromCall
      postOptionsAsync(fullNewOptions);
    }
  }, [options, setOptions]);

  useEffect(() => {
    const loaders = [fetchOptionsAsync(), fetchProjectsAsync()];
    Promise.all(loaders).then(results => {
      const loadedOptions = (results[0] as OptionsResultMessage).options;
      const googleProjects = (results[1] as ProjectsResultMessage).projects;
      setProjects(googleProjects);
      setPartialOptions(loadedOptions, false);
      console.log("initial read done", loadedOptions, googleProjects);
      if (loadedOptions.filter.projectId) {
        setShouldReset(true);
      }
    })
      .catch(error => console.error(error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPageCallback = useCallback(async (isClean: boolean = false) => {
    const result = await fetchPageAsync({
      type: MessageType.FETCH_PAGE,
      pageToken: isClean ? null : nextPageToken || null,
      ...options
    });
    setNextPageToken(result.nextPageToken);
    setEntries(currentEntries => [...currentEntries, ...result.entries]);
    setWebUrl(result.webUrl);
  }, [options, nextPageToken]);

  const resetEntries = useCallback(() => {
    console.log("resetting entries...");
    setEntries([]);
    setNextPageToken(undefined);
    setShowEntries(true);
    setWebUrl(undefined);
    // noinspection JSIgnoredPromiseFromCall
    fetchPageCallback(true);
  }, [setEntries, setNextPageToken, fetchPageCallback]);

  useEffect(() => {
    if (shouldReset) {
      setShouldReset(false);
      resetEntries();
    }
  }, [shouldReset, resetEntries]);

  return (
    <>
      {
        !projects && <Loader type="Audio" title="Loading..." floating size={ 100 }/>
      }
      {
        projects && <StyledOptionsPane
              options={ options }
              projects={ projects }
              setPartialOptions={ partialOptions => setPartialOptions(partialOptions) }
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
      {
        webUrl && <StyledFooter
              webUrl={ webUrl }
              entriesCount={ entries.length }
              hasMore={ nextPageToken !== null }
          />
      }
    </>
  );
};
