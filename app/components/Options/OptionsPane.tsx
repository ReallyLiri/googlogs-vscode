import React from "react";
import Select from "react-select";
import { GoogleProject } from "../../common/googleProject";
import { COLOR_DARK, COLOR_LIGHT, COLOR_MAIN } from "../../style";
import styled from "styled-components";
import { Options } from "../../data/options";
import { LogSeverity, SeverityToColor } from "../../common/filter";
import { Box, OPTION_WIDTH, SELECT_STYLES } from "./Styles";
import { DurationPicker } from "./DurationPicker";

const MARGIN = 16;

const Wrapper = styled.div`
  ${ Box };
  background-color: ${ COLOR_LIGHT };
  padding: ${ MARGIN / 2 }px;
  min-width: calc(100% - ${ MARGIN * 1.5 }px);
  width: fit-content;
`;

const ApplyButton = styled.div<{ disabled: boolean }>`
  ${ Box };
  margin-top: ${ MARGIN }px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  height: ${ MARGIN * 2 }px;
  width: 160px;
  cursor: ${ ({disabled}) => disabled ? "default" : "pointer" };
  background-color: ${ ({disabled}) => disabled ? "white" : COLOR_MAIN };
  color: ${ ({disabled}) => disabled ? COLOR_DARK : "White" };
`;

const Line = styled.div<{ isFirst?: boolean }>`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: ${ ({isFirst}) => isFirst ? 0 : MARGIN }px;
  max-width: 940px;
`;

const Title = styled.span<{ isFirst?: boolean }>`
  font-size: 16px;
  font-weight: bold;
  color: ${ COLOR_MAIN };
  padding-right: ${ MARGIN / 2 }px;
  padding-left: ${ ({isFirst}) => isFirst ? 0 : MARGIN }px;
`;

const StyledInput = styled.input`
  ${ Box };
  height: 20px;
  padding: 8px;
  width: ${ OPTION_WIDTH * 2.5 }px;
  text-align: left;
`;

const Filler = styled.div`
  width: 100%;
  flex: 2;
`;

const formatProjectSelectOption = (project: GoogleProject) =>
  ({value: project.id, label: project.name});
const formatSelectOption = <T extends string>(selectOption: T, display?: string) =>
  ({value: selectOption, label: display ? display : selectOption as string});

type OptionsPaneProps = {
  className?: string,
  options: Options
  projects: GoogleProject[],
  setPartialOptions: (partialOptions: Partial<Options>) => void;
  apply: () => void;
};

function OptionsPane({
                       className,
                       options,
                       projects,
                       setPartialOptions,
                       apply
                     }: OptionsPaneProps) {
  const canApply = options.filter.projectId && options.filter.projectId.length > 0;
  const selectedProject = projects.find(project => project.id === options.filter.projectId);


  return <Wrapper className={ className }>
    <Line isFirst>
      <Title isFirst>Project:</Title>
      <Select
        isClearable
        isSearchable
        styles={ SELECT_STYLES }
        onChange={ selected => setPartialOptions({filter: {projectId: selected?.value ?? ""}}) }
        options={ projects.map(formatProjectSelectOption) }
        value={ selectedProject ? formatProjectSelectOption(selectedProject) : undefined }
      />
      <Filler/>
      <Title>Severities:</Title>
      <Select
        isClearable
        isSearchable
        isMulti
        styles={ {
          ...SELECT_STYLES,
          option: (styles, {data, isFocused}) => ({
            ...styles,
            color: COLOR_DARK,
            backgroundColor: isFocused ? SeverityToColor[data.value] : styles.backgroundColor
          }),
          multiValueRemove: (styles, {data}) => ({
            ...styles,
            ':hover': {
              backgroundColor: SeverityToColor[data.value],
              color: COLOR_DARK,
            },
          })
        } }
        options={ Object.values(LogSeverity).map(v => formatSelectOption(v)) }
        value={ options.filter.severities?.map(v => formatSelectOption(v)) }
        onChange={ selected => setPartialOptions({filter: {severities: selected.map(tup => tup.value)}}) }
      />
    </Line>
    <Line>
      <Title isFirst>Since:</Title>
      <DurationPicker
        selectedValue={ options.filter.fromAgo }
        onChange={ value => setPartialOptions({filter: {fromAgo: value}}) }
        unsetLabel="the beginning of time"/>
      <Filler/>
      <Title>Until:</Title>
      <DurationPicker
        selectedValue={ options.filter.untilAgo }
        onChange={ value => setPartialOptions({filter: {untilAgo: value}}) }
        unsetLabel="now"/>
    </Line>
    <Line>
      <Title isFirst>Query:</Title>
      <Filler/>
      <StyledInput
        type="text"
        defaultValue={ options.filter.text }
        onChange={ e => setPartialOptions({filter: {text: e.target.value}}) }
      />
    </Line>
    <ApplyButton disabled={ !canApply } onClick={ () => canApply && apply() } title={ canApply ? "Apply" : "Disabled - Select all required options" }>
      Apply / Reload
    </ApplyButton>
  </Wrapper>;
}

export default OptionsPane;
