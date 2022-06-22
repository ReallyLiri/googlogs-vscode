import { LogSeverity } from "../../common/filter";
import React from "react";
import { ILogEntryWithCount } from "../../data/dedup";
import styled from "styled-components";
import { EntryFormatter } from "../../data/schema";
import { LogLineStyle, LogTextStyle } from "./Styles";


const LogLine = styled.div<{ severity: LogSeverity }>`
  ${ LogLineStyle };
`;

const MultilineText = styled.div`
  width: 150%;
  ${ LogTextStyle };
`;

const LogLineContent = ({entry, formatter}: { entry: ILogEntryWithCount, formatter: EntryFormatter }) => {
  return <MultilineText>
    { formatter.asString(entry) }{ entry.count && entry.count > 1 && `\n\t(x${ entry.count })` }
  </MultilineText>;
};

type LogLinesProps = {
  entries: ILogEntryWithCount[],
  formatter: EntryFormatter
};

export const LogsLines = ({entries, formatter}: LogLinesProps) => (
  <>
    {
      entries.map((entry, index) => (
        <LogLine key={ index } severity={ entry.severity as LogSeverity }>
          <LogLineContent entry={ entry } formatter={ formatter }/>
        </LogLine>
      ))
    }
  </>
);
