import React from "react";
import styled from "styled-components";
// @ts-ignore
import ColumnResizer from "react-table-column-resizer";
import { COLOR_MAIN } from "../../style";
import { LogSeverity } from "../../common/filter";
import { LogLineStyle, LogTextStyle } from "./Styles";

const Headers = styled.tr<{ offset: number }>`
  position: relative;
  bottom: ${ ({offset}) => offset }px;
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

const Row = styled.tr<{ severity: LogSeverity }>`
  ${LogLineStyle};
`;

const Cell = styled.td`
  ${LogTextStyle};
`;

type TableProps = {
  columns: string[]
  items: Record<string, string>[]
  headerOffset: number
};

export const LogsTable = ({columns, items, headerOffset}: TableProps) => (
  <table>
    <tbody>
    {
      [...items].reverse().map(
        (row, index) =>
          <Row key={ index } severity={row["severity"] as LogSeverity ?? LogSeverity.INFO}>
            {
              columns.map(
                column => <>
                  <Cell key={ index }>{ row[column] }</Cell>
                  <td className="columnResizer" key={ index + "_resize" }/>
                </>
              )
            }
          </Row>
      )
    }
    </tbody>
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
  </table>
);
/*

    <tr>
      {
        columns.map(
          column => <>
            <td><div style={{position: "absolute", top: 500}}>{ column }</div></td>
            <td className="columnResizer"/>
          </>
        )
      }
    </tr>
 */