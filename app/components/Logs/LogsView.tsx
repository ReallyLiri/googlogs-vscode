import InfiniteScroll from "react-infinite-scroll-component";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { google } from "@google-cloud/logging/build/protos/protos";
import styled from "styled-components";
import Loader from "../Loader";
import { COLOR_MAIN } from "../../style";
// @ts-ignore
import * as objectPath from "object-path";
import { useWindowHeight } from "@react-hook/window-size";
import { buildFormatter, EntryFormatter } from "../../data/schema";
import { ILogEntryWithCount } from "../../data/dedup";
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

const toStringColumns = (entries: ILogEntryWithCount[], formatter: EntryFormatter) => {
  const columns = new Set<string>();
  const items = entries.map(entry => {
    const record = formatter.asMap(entry);
    Object.keys(record).forEach(column => columns.add(column));
    return record;
  });
  return {items, columns: Array.from(columns)};
};

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
  const [entryCount, setEntryCount] = useState(entries.length);

  const formatter = useMemo(() => buildFormatter(schema), [schema]);

  useEffect(() => {
    if (entryCount !== entries.length && wrapperRef.current) {
      let wrapperElement = wrapperRef.current as Element;
      if (wrapperElement.scrollTop !== scrollOffset) {
        wrapperElement.scrollTo(wrapperElement.scrollLeft, scrollOffset);
      }
    }
  }, [entries.length, entryCount, scrollOffset, wrapperRef]);

  return (
    <Wrapper
      id="scrollableDiv"
      ref={ wrapperRef }
      className={ className }
      isEmpty={ isEmpty }
      height={ windowHeight - optionsPaneHeight - 46 }
    >
      {
        noResults
          ? <NoResults>No logs found 😔 Try to refine your search</NoResults>
          : <InfiniteScroll
            dataLength={ entries.length }
            next={ async () => {
              console.log("fetching next");
              await fetchNext();
            } }
            style={ {display: "flex", flexDirection: "column-reverse", paddingBottom: 8} }
            inverse
            hasMore={ hasMore }
            loader={ <Loader type="Grid" floating={ isEmpty } size={ isEmpty ? 64 : 32 }/> }
            scrollableTarget="scrollableDiv"
            onScroll={ event => setScrollOffset((event.target as Element)?.scrollTop ?? 0) }
          >
            {
              tableView
                ? <LogsTable { ...toStringColumns(entries, formatter) } headerOffset={ optionsPaneHeight + Math.abs(scrollOffset) + 200 }/>
                : <LogsLines entries={ entries } formatter={ formatter }/>
            }
          </InfiniteScroll>
      }
    </Wrapper>
  );
};
