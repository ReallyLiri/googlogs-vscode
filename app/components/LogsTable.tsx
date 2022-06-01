import InfiniteScroll from "react-infinite-scroll-component";
import React from "react";
import { google } from "@google-cloud/logging/build/protos/protos";
import ILogEntry = google.logging.v2.ILogEntry;

type LogsTableProps = {
  entries: ILogEntry[],
  fetchNext: () => Promise<void>,
  hasMore: boolean
};

export const LogsTable = ({entries, fetchNext, hasMore}: LogsTableProps) =>
  (
    <div
      id="scrollableDiv"
      style={ {
        height: 100,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column-reverse',
      } }
    >
      <InfiniteScroll
        dataLength={ entries.length }
        next={ fetchNext }
        style={ {display: "flex", flexDirection: "column-reverse"} }
        inverse
        hasMore={ hasMore }
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
  );

