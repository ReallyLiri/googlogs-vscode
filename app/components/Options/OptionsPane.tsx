import React, { MutableRefObject } from "react";
import Select from "react-select";
import { GoogleProject } from "../../common/googleProject";
import { COLOR_DARK, COLOR_LIGHT, COLOR_MAIN } from "../../style";
import styled, { css } from "styled-components";
import { DEFAULT_PAGE_SIZE, Options } from "../../data/options";
import { LogSeverity, SeverityToColor } from "../../common/filter";
import { Box, InputStyle, OPTION_WIDTH, SELECT_STYLES } from "./Styles";
import { DurationPicker } from "./DurationPicker";
import NumberPicker from "./NumberPicker";
import TagsInput from "./TagsInput";
import Hint from "./Hint";

const MARGIN = 16;

const COMMON_PROPERTIES = [
"resource.labels.project_id",
"resource.labels.cluster_name",
"resource.labels.namespace_name",
"resource.labels.pod_name",
"resource.labels.container_name",
];

const Wrapper = styled.div`
  ${ Box };
  background-color: ${ COLOR_LIGHT };
  padding: ${ MARGIN / 2 }px;
  min-width: calc(100% - ${ MARGIN * 1.5 }px);
  width: fit-content;
`;

const ButtonStyle = css`
  ${ Box };
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  height: 34px;
  cursor: pointer;
`;

const ApplyButton = styled.div<{ disabled: boolean }>`
  ${ ButtonStyle };
  width: 160px;
  cursor: ${ ({disabled}) => disabled ? "default" : "pointer" };
  background-color: ${ ({disabled}) => disabled ? "white" : COLOR_MAIN };
  color: ${ ({disabled}) => disabled ? COLOR_DARK : "White" };
`;

const ActionButton = styled.div`
  ${ ButtonStyle };
  width: 100px;
  background-color: ${ COLOR_DARK };
  color: white;
  margin-left: 4px;
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

const StyledInput = styled.input<{ color?: string }>`
  ${ InputStyle };
  padding: 8px;
  width: ${ OPTION_WIDTH * 2.5 }px;
  color: ${ ({color}) => color ?? COLOR_DARK };
`;

const Filler = styled.div`
  width: 100%;
  flex: 2;
`;

const CollapseButton = styled.div<{ collapsed: boolean }>`
  ${ ButtonStyle };
  border-radius: 50%;
  background-color: ${ COLOR_MAIN };
  color: white;
  cursor: pointer;
  height: 24px;
  width: 24px;
  margin-left: ${ MARGIN / 2 }px;
  padding-top: 4px;
  transform: ${ ({collapsed}) => collapsed ? "scaleY(-1)" : "unset" };
  box-sizing: border-box;
`;

const formatProjectSelectOption = (project: GoogleProject) =>
  ({value: project.id, label: project.name});
const formatSelectOption = <T extends string>(selectOption: T, display?: string) =>
  ({value: selectOption, label: display ? display : selectOption as string});

type OptionsPaneProps = {
  forwardedRef?: MutableRefObject<any>,
  className?: string,
  options: Options
  projects: GoogleProject[],
  setPartialOptions: (partialOptions: Partial<Options>) => void;
  apply: () => void;
  triggerLoad: () => void;
  triggerSaveAs: () => void;
  collapsed: boolean;
  toggleCollapsed: () => void;
};

function OptionsPane({
                       forwardedRef,
                       className,
                       options,
                       projects,
                       setPartialOptions,
                       apply,
                       triggerLoad,
                       triggerSaveAs,
                       collapsed,
                       toggleCollapsed
                     }: OptionsPaneProps) {
  const canApply = options.filter.projectId && options.filter.projectId.length > 0;
  const selectedProject = projects.find(project => project.id === options.filter.projectId);

  return <Wrapper className={ className } ref={ forwardedRef }>
    { !collapsed &&
        <>
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
                <Title isFirst>Namespaces:</Title>
                <TagsInput
                    values={ options.filter.namespaces }
                    onChange={ (namespaces) => setPartialOptions({filter: {namespaces}}) }
                    placeholder="Enter a namespace"
                />
                <Filler/>
                <Title>Deployments:</Title>
                <TagsInput
                    values={ options.filter.containerNames }
                    onChange={ (containerNames) => setPartialOptions({filter: {containerNames}}) }
                    placeholder="Enter a name"
                />
                <Filler/>
            </Line>
            <Line>
                <Title isFirst>Query:</Title>
                <Filler/>
                <StyledInput
                    type="text"
                    placeholder='For example: resource.labels.cluster_name="prod" AND NOT timeout'
                    defaultValue={ options.filter.text }
                    onChange={ e => setPartialOptions({filter: {text: e.target.value}}) }
                />
                <Hint content={`Common properties: ${COMMON_PROPERTIES.join(" ")}`}/>
            </Line>
            <Line>
                <Title isFirst>Schema:</Title>
                <Filler/>
                <StyledInput
                    type="text"
                    placeholder="Use dot notation to access log properties"
                    defaultValue={ options.schema }
                    onChange={ e => setPartialOptions({schema: e.target.value}) }
                    color={ COLOR_MAIN }
                />
            </Line>
        </>
    }
    <Line isFirst={ collapsed }>
      <ApplyButton disabled={ !canApply } onClick={ () => canApply && apply() } title={ canApply ? "Apply" : "Disabled - Select all required options" }>
        Apply / Reload
      </ApplyButton>
      <CollapseButton onClick={ toggleCollapsed } title={ collapsed ? "Expand" : "Collapse" } collapsed={ collapsed }>
        ^
      </CollapseButton>
      <Filler/>
      {
        !collapsed && <>
              <Title>Page size:</Title>
              <NumberPicker
                  value={ options.pageSize }
                  setValue={ value => setPartialOptions({pageSize: value ?? DEFAULT_PAGE_SIZE}) }
              />
              <ActionButton title="Load" onClick={ () => triggerLoad() }>Load</ActionButton>
              <ActionButton title="Save as" onClick={ () => triggerSaveAs() }>Save as</ActionButton>
          </>
      }
    </Line>
  </Wrapper>;
}

export default OptionsPane;
