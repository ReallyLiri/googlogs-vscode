import { css } from "styled-components";
import { LogSeverity, SeverityToColor } from "../../common/filter";

export const LogTextStyle = css`
  word-wrap: break-word;
  white-space: pre-wrap;
  word-break: break-word;
  
  :hover {
    background-color: rgba(255, 255, 255, 0.05);
  }

  ::selection {
    background-color: black;
  }
`;

export const LogLineStyle = css<{ severity: LogSeverity }>`
  color: ${ ({severity}) => SeverityToColor[severity] };
  padding: 4px;
  margin: 4px 0 0 4px;
`;
