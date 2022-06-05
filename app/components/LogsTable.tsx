import InfiniteScroll from "react-infinite-scroll-component";
import React from "react";
import { google } from "@google-cloud/logging/build/protos/protos";
import styled from "styled-components";
import Loader from "./Loader";
import ILogEntry = google.logging.v2.ILogEntry;
import { COLOR_MAIN } from "../style";

const TableHeight = window.innerHeight - 184;

const Wrapper = styled.div<{ isEmpty: boolean }>`
  height: ${ ({isEmpty}) => isEmpty ? 64 : TableHeight }px;
  overflow: auto;
  display: flex;
  flex-direction: column-reverse;
`;

const NoResults = styled.div`
  text-align: center;
  font-size: 16px;
  color: ${ COLOR_MAIN };
`;

type LogsTableProps = {
  className?: string,
  entries: ILogEntry[],
  fetchNext: () => Promise<void>,
  hasMore: boolean
};

export const LogsTable = ({className, entries, fetchNext, hasMore}: LogsTableProps) => {
  const isEmpty = entries.length === 0;
  const noResults = isEmpty && !hasMore;
  return (
    <Wrapper
      id="scrollableDiv"
      className={ className }
      isEmpty={ isEmpty }
    >
      {
        noResults
          ? <NoResults>No logs found 😔 Try to refine your search</NoResults>
          : <InfiniteScroll
            dataLength={ entries.length }
            next={ fetchNext }
            style={ {display: "flex", flexDirection: "column-reverse"} }
            inverse
            hasMore={ hasMore }
            loader={ <Loader type="Grid" floating={ isEmpty } size={ isEmpty ? 64 : 32 }/> }
            scrollableTarget="scrollableDiv"
          >
            { entries.map((entry, index) => (
              <div key={ index }>
                { JSON.stringify(entry) }
              </div>
            )) }
          </InfiniteScroll>
      }
    </Wrapper>
  );
};
