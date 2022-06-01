import React, { useCallback, useEffect, useState } from 'react';
import { GoogleProject } from "../common/googleProject";
import { getDefaultOptions, Options } from "../data/options";
import { fetchPageAsync, fetchProjectsAsync, isBrowserDebug } from "../data/fetchData";
import InfiniteScroll from "react-infinite-scroll-component";
import { MessageType } from "../common/messageType";
import { google } from "@google-cloud/logging/build/protos/protos";
import ILogEntry = google.logging.v2.ILogEntry;


export const App = () => {
  const [options, setOptions] = isBrowserDebug
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
  }, [setOptions, resetEntries]);

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
  }, [projects, setProjects]);

  const fetchPageCallback = useCallback(async () => {
    const result = await fetchPageAsync({
      type: MessageType.FETCH_PAGE,
      pageToken: nextPageToken || null,
      ...options
    });
    setNextPageToken(result.nextPageToken);
    setEntries(currentEntries => [...currentEntries, ...result.entries]);
  }, [options, nextPageToken]);

  return (
    <>
      <div>
        { projects.map(project => <div key={ project.id } onClick={ () => setProject(project.id) }>{ project.name }</div>) }
      </div>
      {
        projectIsSelected && <div
              id="scrollableDiv"
              style={ {
                height: 300,
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column-reverse',
              } }
          >
              <InfiniteScroll
                  dataLength={ entries.length }
                  next={ fetchPageCallback }
                  style={ {display: 'flex', flexDirection: 'column-reverse', height: 500} }
                  inverse
                  hasMore={ true }
                  loader={ <h4>Loading...</h4> }
                  scrollableTarget="scrollableDiv"
              >
                { entries.map((entry, index) => (
                  <div key={ index }>
                    { JSON.stringify(entry) }
                  </div>
                )) }
              </InfiniteScroll>
          </div>
      }
    </>
  );
};
