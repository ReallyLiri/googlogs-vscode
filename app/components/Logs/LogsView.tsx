import InfiniteScroll from "react-infinite-scroll-component";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { google } from "@google-cloud/logging/build/protos/protos";
import styled from "styled-components";
import Loader from "../Loader";
import { COLOR_MAIN } from "../../style";
// @ts-ignore
import * as objectPath from "object-path";
import { useWindowHeight } from "@react-hook/window-size";
import { buildFormatter } from "../../data/schema";
import { LogsTable } from "./LogsTable";
import { LogsLines } from "./LogLines";
import ILogEntry = google.logging.v2.ILogEntry;

const Wrapper = styled.div<{ isEmpty: boolean, height: number }>`
  min-height: 64px;
  height: fit-content;
  max-height: ${ ({height}) => height }px;
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
  hasMore: boolean,
  schema: string,
  optionsPaneHeight: number,
  dedup: boolean,
  tableView: boolean,
};

export const LogsView = ({className, entries, fetchNext, hasMore, schema, optionsPaneHeight, tableView}: LogsTableProps) => {
  const isEmpty = entries.length === 0;
  const noResults = isEmpty && !hasMore;
  const windowHeight = useWindowHeight();
  const [scrollOffset, setScrollOffset] = useState(0);
  const wrapperRef = useRef(null);

  const formatter = useMemo(() => buildFormatter(schema), [schema]);

  const viewHeight = windowHeight - optionsPaneHeight - 46;

  useEffect(() => {
    if (wrapperRef.current) {
      const wrapperElement = wrapperRef.current as Element;
      if (wrapperElement.scrollTop !== scrollOffset) {
        wrapperElement.scrollTo(wrapperElement.scrollLeft, scrollOffset);
      }
    }
  }, [entries.length, scrollOffset, wrapperRef]);

  useEffect(() => {
    if (wrapperRef.current) {
      const wrapperElement = wrapperRef.current as HTMLElement;
      if (wrapperElement.scrollHeight < (viewHeight + 32) && hasMore) {
        // noinspection JSIgnoredPromiseFromCall
        fetchNext();
      }
    }
  });

  return (
    <Wrapper
      id="scrollableDiv"
      ref={ wrapperRef }
      className={ className }
      isEmpty={ isEmpty }
      height={ viewHeight }
    >
      {
        noResults
          ? <NoResults>No logs found 😔 Try to refine your search</NoResults>
          : <InfiniteScroll
            dataLength={ entries.length }
            next={ () => fetchNext() }
            style={ {display: "flex", flexDirection: "column-reverse", paddingBottom: 8} }
            inverse
            hasMore={ hasMore }
            loader={ <Loader type="Grid" floating={ isEmpty } size={ isEmpty ? 64 : 32 }/> }
            scrollableTarget="scrollableDiv"
            onScroll={ event => setScrollOffset((event.target as Element)?.scrollTop ?? 0) }
          >
            {
              tableView
                ? <LogsTable entries={ entries } formatter={ formatter } headerOffset={ viewHeight + Math.abs(scrollOffset) }/>
                : <LogsLines entries={ entries } formatter={ formatter }/>
            }
          </InfiniteScroll>
      }
    </Wrapper>
  );
};
