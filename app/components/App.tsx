import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GoogleProject } from "../common/googleProject";
import { getDefaultOptions, Options } from "../data/options";
import { fetchOptionsAsync, fetchPageAsync, fetchProjectsAsync, loadAsync, postOptionsAsync, saveAsAsync } from "../data/fetchData";
import { MessageType } from "../common/messageType";
import { google } from "@google-cloud/logging/build/protos/protos";
import { LogsTable } from "./LogsTable";
import Loader from "./Loader";
import OptionsPane from "./Options/OptionsPane";
import styled from "styled-components";
import { OptionsResultMessage, ProjectsResultMessage } from "../common/message";
import { Footer } from "./Footer";
import Error from "./Error";
import { ErrorBoundary } from "react-error-boundary";
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
  const [error, setError] = useState<string>();
  const [options, setOptions] = useState<Options>(getDefaultOptions(""));
  const [entries, setEntries] = useState<ILogEntry[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>();
  const [projects, setProjects] = useState<GoogleProject[]>();
  const projectIsSelected = !!options.filter.projectId;
  const [showEntries, setShowEntries] = useState(projectIsSelected);
  const [shouldReset, setShouldReset] = useState<boolean>(false);
  const [webUrl, setWebUrl] = useState<string>();
  const [optionsCollapsed, setOptionsCollapsed] = useState(false);
  const optionsPaneRef = useRef<HTMLElement>(null);
  const [optionsPaneHeight, setOptionsPaneHeight] = useState(0);

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
      const loadedOptions = (results[0] as OptionsResultMessage).options || getDefaultOptions("");
      const {projects: googleProjects, commandMissing} = (results[1] as ProjectsResultMessage);
      if (commandMissing) {
        setError("gcloud command is not installed or not accessible");
        return;
      }
      if (projects?.length === 0) {
        setError("no cloud projects found");
        return;
      }
      setProjects(googleProjects);
      setPartialOptions(loadedOptions, false);
      console.log("initial read done", loadedOptions, googleProjects);
      if (loadedOptions.filter.projectId) {
        setShouldReset(true);
      }
    })
      .catch(error => {
        console.error(error);
        setError("failed to load");
      });
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
    fetchPageCallback(true)
      .catch(() => setError("failed to fetch logs"));
  }, [setEntries, setNextPageToken, fetchPageCallback]);

  useEffect(() => {
    if (shouldReset) {
      setShouldReset(false);
      resetEntries();
    }
  }, [shouldReset, resetEntries]);

  const saveAs = useCallback(() => {
    saveAsAsync(options)
      .catch(() => setError("failed to save state"));
  }, [options]);

  const load = useCallback(() => {
    loadAsync().then(optionsResult => {
      if (optionsResult.options) {
        setOptions(optionsResult.options);
        setShouldReset(true);
      }
    });
  }, [setOptions, setShouldReset]);

  useEffect(() => {
    setOptionsPaneHeight(optionsPaneRef.current?.clientHeight || 0);
  }, [optionsPaneRef.current, optionsCollapsed]);

  if (error) {
    return <Error error={ error }/>;
  }
  return (
    <ErrorBoundary FallbackComponent={ props => <Error error={ props.error.message }/> }>
      {
        !projects && <Loader type="Audio" title="Loading..." floating size={ 100 }/>
      }
      {
        projects && <StyledOptionsPane
              forwardedRef={ optionsPaneRef }
              options={ options }
              projects={ projects }
              setPartialOptions={ partialOptions => setPartialOptions(partialOptions) }
              apply={ () => resetEntries() }
              triggerLoad={ load }
              triggerSaveAs={ saveAs }
              collapsed={ optionsCollapsed }
              toggleCollapsed={ () => setOptionsCollapsed(collapsed => !collapsed) }
          />
      }
      {
        projects && showEntries && <StyledLogsTable
              entries={ entries }
              fetchNext={ fetchPageCallback }
              hasMore={ nextPageToken !== null }
              schema={ options.schema }
              optionsPaneHeight={ optionsPaneHeight }
          />
      }
      {
        webUrl && <StyledFooter
              webUrl={ webUrl }
              entriesCount={ entries.length }
              hasMore={ nextPageToken !== null }
          />
      }
    </ErrorBoundary>
  );
};
