import InfiniteScroll from "react-infinite-scroll-component";
import React from "react";
import { google } from "@google-cloud/logging/build/protos/protos";
import styled from "styled-components";
import ILogEntry = google.logging.v2.ILogEntry;
import Loader from "./Loader";

const TableHeight = window.innerHeight - 184;

const Wrapper = styled.div<{isEmpty: boolean}>`
  height: ${({isEmpty}) => isEmpty ? 64 : TableHeight}px;
  overflow: auto;
  display: flex;
  flex-direction: column-reverse;
`;

type LogsTableProps = {
  className?: string,
  entries: ILogEntry[],
  fetchNext: () => Promise<void>,
  hasMore: boolean
};

export const LogsTable = ({className, entries, fetchNext, hasMore}: LogsTableProps) => {
  let isEmpty = entries.length === 0;
  return (
    <Wrapper
      id="scrollableDiv"
      className={ className }
      isEmpty={ isEmpty }
    >
      <InfiniteScroll
        dataLength={ entries.length }
        next={ fetchNext }
        style={ {display: "flex", flexDirection: "column-reverse"} }
        inverse
        hasMore={ hasMore }
        loader={ <Loader type="Grid" floating={ isEmpty } size={isEmpty ? 64 : 32}/> }
        scrollableTarget="scrollableDiv"
      >
        { entries.map((entry, index) => (
          <div key={ index }>
            { JSON.stringify(entry) }
          </div>
        )) }
      </InfiniteScroll>
    </Wrapper>
  );
};
