import React from "react";
import Select from "react-select";
import { GoogleProject } from "../common/googleProject";
import { COLOR_DARK, COLOR_LIGHT, COLOR_MAIN } from "../style";
import styled, { css } from "styled-components";
import { Options } from "../data/options";

const PROJECT_OPTION_WIDTH = 320;
const MARGIN = 32;

const Box = css`
  border-radius: 4px;
  border: 1px solid hsl(0, 0%, 80%);
`;

const Wrapper = styled.div`
  ${ Box };
  background-color: ${ COLOR_LIGHT };
  padding: ${ MARGIN / 2 }px;
  padding-right: ${ PROJECT_OPTION_WIDTH };
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

const Title = styled.span`
  font-size: 16px;
  font-weight: bold;
  color: ${ COLOR_MAIN };
  padding-right: ${ MARGIN / 2 }px;
`;

type OptionsPaneProps = {
  className?: string,
  options: Options
  projects: GoogleProject[],
  setSelectedProject: (project: string | undefined) => void;
  apply: () => void;
};

function OptionsPane({className, options, projects, setSelectedProject, apply}: OptionsPaneProps) {
  const canApply = options.filter.projectId.length > 0;
  const selected = projects.find(project => project.id === options.filter.projectId);
  return <Wrapper className={ className }>
    <Line>
      <Title>Project:</Title>
      <Select
        isClearable
        isSearchable
        onChange={ selected => setSelectedProject(selected?.value) }
        options={ projects.map(project => ({value: project.id, label: project.name})) }
        value={ selected ? {value: selected.id, label: selected.name} : undefined }
        styles={ {
          control: (styles) => ({...styles, width: PROJECT_OPTION_WIDTH}),
          menu: (styles) => ({...styles, width: PROJECT_OPTION_WIDTH}),
          singleValue: (styles, {data}) => ({...styles, color: COLOR_MAIN}),
          option: (styles, {data}) => ({...styles, color: COLOR_DARK}),
        } }
      />
    </Line>
    <ApplyButton disabled={ !canApply } onClick={ () => canApply && apply() } title={ canApply ? "Apply" : "Disabled - Select all required options" }>
      Apply / Reload
    </ApplyButton>
  </Wrapper>;
}

export default OptionsPane;
