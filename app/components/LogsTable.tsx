import InfiniteScroll from "react-infinite-scroll-component";
import React from "react";
import { google } from "@google-cloud/logging/build/protos/protos";
import styled from "styled-components";
import Loader from "./Loader";
import { COLOR_MAIN } from "../style";
import { LogSeverity, SeverityToColor } from "../common/filter";
import ILogEntry = google.logging.v2.ILogEntry;
import * as moment from "moment";
// @ts-ignore
import * as objectPath from "object-path";

const TableHeight = window.innerHeight - 320;

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

const LogLine = styled.div<{ severity: LogSeverity }>`
  color: ${ ({severity}) => SeverityToColor[severity] };
  padding: 4px;
  margin: 4px 0 0 4px;
`;

const LogContent = ({entry}: { entry: ILogEntry }) => {
  const json = entry.jsonPayload!;
  const stackTrace = objectPath.get(json, "e")?.replaceAll("\n", "<br>").replaceAll("\t", "&#9;");
  return <>
    { `${ moment.utc((entry.timestamp as string)).format("YYYY-MM-DD HH:mm:ss")} [${entry.severity}] ${objectPath.get(json, "caller")} ${JSON.stringify(objectPath.get(json, "mdc"))} - ${objectPath.get(json, "message")} - ${stackTrace}` }
  </>;
};

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
              <LogLine key={ index } severity={ entry.severity as LogSeverity }>
                <LogContent entry={ entry }/>
              </LogLine>
            )) }
          </InfiniteScroll>
      }
    </Wrapper>
  );
};
