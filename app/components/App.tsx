import React, { useCallback, useEffect, useState } from 'react';
import { Entry } from "@google-cloud/logging";
import { GoogleProject } from "../common/googleProject";
import { getDefaultOptions } from "../data/options";
import { fetchPageAsync, fetchProjectsAsync } from "../data/fetchData";
import { MessageType } from "../common/message";
import InfiniteScroll from "react-infinite-scroll-component";


export const App = () => {
  const [options, setOptions] = [vscode.getState() || getDefaultOptions(""), vscode.setState];
  const [entries, setEntries] = useState<Entry[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>();
  const [projects, setProjects] = useState<GoogleProject[]>([]);

  useEffect(() => {
    fetchProjectsAsync()
      .then(projectsResult => {
        const googleProjects = projectsResult.projects;
        if (googleProjects.length === 0) {
          console.error("no projects were fetched");
          return;
        }
        setProjects(googleProjects);
        if (options.filter.projectId.length === 0) {
          setOptions({...options, filter: {...options.filter, projectId: googleProjects[0].id}})
        }
      })
      .catch(error => console.error(error));
  });

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
        { projects.map(project => <div key={ project.id }>{ project.name }</div>) }
      </div>
      <div
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
          style={ {display: 'flex', flexDirection: 'column-reverse'} }
          inverse
          hasMore={ nextPageToken === null }
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
    </>
  );
};
