import InfiniteScroll from "react-infinite-scroll-component";
import React, { useMemo } from "react";
import { google } from "@google-cloud/logging/build/protos/protos";
import styled from "styled-components";
import Loader from "./Loader";
import { COLOR_MAIN } from "../style";
import { LogSeverity, SeverityToColor } from "../common/filter";
// @ts-ignore
import * as objectPath from "object-path";
import { useWindowHeight } from "@react-hook/window-size";
import { buildFormatter, EntryFormatter } from "../data/schema";
import ILogEntry = google.logging.v2.ILogEntry;

const Wrapper = styled.div<{ isEmpty: boolean, windowHeight: number }>`
  min-height: 64px;
  height: fit-content;
  max-height: ${ ({windowHeight}) => windowHeight - 370 }px;
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

  :hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

const MultilineText = styled.div`
  width: 150%;
  word-wrap: break-word;
  white-space: pre-wrap;
  word-break: break-word;
`;

const LogContent = ({entry, formatter}: { entry: ILogEntry, formatter: EntryFormatter }) => {
  return <MultilineText>
    { formatter(entry) }
  </MultilineText>;
};

type LogsTableProps = {
  className?: string,
  entries: ILogEntry[],
  fetchNext: () => Promise<void>,
  hasMore: boolean,
  schema: string
};

export const LogsTable = ({className, entries, fetchNext, hasMore, schema}: LogsTableProps) => {
  const isEmpty = entries.length === 0;
  const noResults = isEmpty && !hasMore;
  const windowHeight = useWindowHeight();

  const formatter = useMemo(() => buildFormatter(schema), [schema]);

  return (
    <Wrapper
      id="scrollableDiv"
      className={ className }
      isEmpty={ isEmpty }
      windowHeight={ windowHeight }
    >
      {
        noResults
          ? <NoResults>No logs found 😔 Try to refine your search</NoResults>
          : <InfiniteScroll
            dataLength={ entries.length }
            next={ fetchNext }
            style={ {display: "flex", flexDirection: "column-reverse", paddingBottom: 8} }
            inverse
            hasMore={ hasMore }
            loader={ <Loader type="Grid" floating={ isEmpty } size={ isEmpty ? 64 : 32 }/> }
            scrollableTarget="scrollableDiv"
          >
            { entries.filter(entry => entry.jsonPayload).map((entry, index) => (
              <LogLine key={ index } severity={ entry.severity as LogSeverity }>
                <LogContent entry={ entry } formatter={ formatter }/>
              </LogLine>
            )) }
          </InfiniteScroll>
      }
    </Wrapper>
  );
};
