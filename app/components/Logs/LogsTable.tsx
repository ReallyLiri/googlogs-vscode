import React from "react";
import styled from "styled-components";
// @ts-ignore
import ColumnResizer from "react-table-column-resizer";
import { COLOR_MAIN } from "../../style";
import { LogSeverity } from "../../common/filter";
import { LogHover, LogLineStyle, LogTextStyle } from "./Styles";
import { ILogEntryWithCount } from "../../data/dedup";
import { EntryFormatter } from "../../data/schema";

const HEADER_HEIGHT = 50;

const Headers = styled.tr<{ offset: number }>`
  position: relative;
  bottom: ${ ({offset}) => offset - HEADER_HEIGHT }px;
`;

const Body = styled.tbody`
  position: relative;
  bottom: ${ -1 * HEADER_HEIGHT + 10 }px;
`;

const Header = styled.td`
  padding: 8px;
  border-radius: 4px;
  background-color: ${ COLOR_MAIN };
  color: white;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StyledColumnResizer = styled(ColumnResizer)`
  background-color: white;
  margin: 2px;
`;

const ResizePlaceholder = styled.td`
  background-color: white;
  opacity: 20%;
`;

const Row = styled.tr<{ severity: LogSeverity }>`
  ${ LogLineStyle };
  ${ LogHover };
`;

const Cell = styled.td`
  ${ LogTextStyle };
`;

const COUNT_COLUMN = "count";

const toTableView = (entries: ILogEntryWithCount[], formatter: EntryFormatter) => {
  const columnsSet = new Set<string>();
  let columnsList: string[] = [];
  const items = entries.map(entry => {
    const record = formatter.asRecord(entry);
    if (entry.count !== undefined) {
      record[COUNT_COLUMN] = entry.count.toString();
    }
    Object.keys(record).forEach(column => {
      if (!columnsSet.has(column)) {
        columnsSet.add(column);
        columnsList = [...columnsList, column];
      }
    });
    return record;
  });
  items.reverse();
  if (columnsList.includes(COUNT_COLUMN)) {
    columnsList = [...columnsList.filter(column => column !== COUNT_COLUMN), COUNT_COLUMN];
  }
  return {items, columns: columnsList};
};

type TableProps = {
  entries: ILogEntryWithCount[]
  formatter: EntryFormatter
  headerOffset: number
};

export const LogsTable = ({entries, formatter, headerOffset}: TableProps) => {
  const {items, columns} = toTableView(entries, formatter);
  return <table>
    <Body>
      {
        items.map(
          (row, index) =>
            <Row key={ index } severity={ row["severity"] as LogSeverity ?? LogSeverity.INFO }>
              {
                columns.map(
                  column => <>
                    <Cell key={ index }>{ row[column] }</Cell>
                    <ResizePlaceholder className="columnResizer" key={ index + "_resize" }/>
                  </>
                )
              }
            </Row>
        )
      }
    </Body>
    <Headers offset={ headerOffset }>
      {
        columns.map(
          column => <>
            <Header key={ column } title={ column }>{ column }</Header>
            <StyledColumnResizer className="columnResizer" key={ column + "_resize" } title="Resize"/>
          </>
        )
      }
    </Headers>
  </table>;
};
