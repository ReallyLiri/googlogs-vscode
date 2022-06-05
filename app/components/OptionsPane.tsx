import React from "react";
import Select, { CSSObjectWithLabel } from "react-select";
import { GoogleProject } from "../common/googleProject";
import { COLOR_DARK, COLOR_LIGHT, COLOR_MAIN } from "../style";
import styled, { css } from "styled-components";
import { Options } from "../data/options";
import { LogSeverity, SeverityToColor } from "../common/filter";

const OPTION_WIDTH = 360;
const MARGIN = 32;

const Box = css`
  border-radius: 4px;
  border: 1px solid hsl(0, 0%, 80%);
`;

const Wrapper = styled.div`
  ${ Box };
  background-color: ${ COLOR_LIGHT };
  padding: ${ MARGIN / 2 }px;
`;

const ApplyButton = styled.div<{ disabled: boolean }>`
  ${ Box };
  margin-top: ${ MARGIN }px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  height: ${ MARGIN }px;
  width: 160px;
  cursor: ${ ({disabled}) => disabled ? "default" : "pointer" };
  background-color: ${ ({disabled}) => disabled ? "white" : COLOR_MAIN };
  color: ${ ({disabled}) => disabled ? COLOR_DARK : "White" };
`;

const Line = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const Title = styled.span<{isFirst?: boolean}>`
  font-size: 16px;
  font-weight: bold;
  color: ${ COLOR_MAIN };
  padding-right: ${ MARGIN / 2 }px;
  padding-left: ${({isFirst}) => isFirst ? 0 : MARGIN/2}px;
`;

const SELECT_STYLES = {
  control: (styles: CSSObjectWithLabel) => ({...styles, width: OPTION_WIDTH}),
  menu: (styles: CSSObjectWithLabel) => ({...styles, width: OPTION_WIDTH}),
  singleValue: (styles: CSSObjectWithLabel) => ({...styles, color: COLOR_MAIN}),
  option: (styles: CSSObjectWithLabel) => ({...styles, color: COLOR_DARK}),
};

type OptionsPaneProps = {
  className?: string,
  options: Options
  projects: GoogleProject[],
  setPartialOptions: (partialOptions: Partial<Options>) => void;
  apply: () => void;
};

const formatProjectSelectOption = (project: GoogleProject) => ({value: project.id, label: project.name});
const formatSelectOption = <T extends string>(selectOption: T) => ({value: selectOption, label: selectOption as string});

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
    <Line>
      <Title isFirst>Project:</Title>
      <Select
        isClearable
        isSearchable
        styles={ SELECT_STYLES }
        onChange={ selected => setPartialOptions({filter: {projectId: selected?.value ?? ""}}) }
        options={ projects.map(formatProjectSelectOption) }
        value={ selectedProject ? formatProjectSelectOption(selectedProject) : undefined }
      />
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
          multiValueRemove: (styles, { data }) => ({
            ...styles,
            ':hover': {
              backgroundColor: SeverityToColor[data.value],
              color: COLOR_DARK,
            },
          })
        } }
        options={ Object.values(LogSeverity).map(formatSelectOption) }
        value={ options.filter.severities?.map(formatSelectOption) }
        onChange={ selected => setPartialOptions({filter: {severities: selected.map(tup => tup.value)}}) }
      />
    </Line>
    <ApplyButton disabled={ !canApply } onClick={ () => canApply && apply() } title={ canApply ? "Apply" : "Disabled - Select all required options" }>
      Apply / Reload
    </ApplyButton>
  </Wrapper>;
}

export default OptionsPane;
