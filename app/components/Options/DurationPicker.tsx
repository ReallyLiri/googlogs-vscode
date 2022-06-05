import Select, { CSSObjectWithLabel } from "react-select";
import React, { useState } from "react";
import { Box, OPTION_WIDTH, SELECT_STYLES } from "./Styles";
import { Duration, DurationUnits } from "../../common/filter";
import styled from "styled-components";
import { COLOR_DARK } from "../../style";

const StyledInput = styled.input`
  ${ Box };
  height: 34px;
  margin-right: 4px;
  width: 64px;
  text-align: center;
`;

const toInt = (num: string) => {
  const asInt = parseInt(num);
  return isNaN(asInt) ? undefined : asInt;
};

const AgoLabel = styled.span`
  font-size: 16px;
  font-weight: bold;
  color: ${ COLOR_DARK };
  margin-left: 8px;
`;

type DurationPickerProps = {
  selectedValue?: Duration,
  onChange: (value: Duration | undefined) => void,
  unsetLabel: string
};

export function DurationPicker({selectedValue, onChange, unsetLabel}: DurationPickerProps) {
  const [unit, setUnit] = useState<DurationUnits | undefined>(selectedValue?.unit);
  const [value, setValue] = useState<number | undefined>(selectedValue?.value);
  const formatUnitOption = (unit: DurationUnits) => ({
    value: unit, label: unit === DurationUnits.none ? unsetLabel : `${ unit }s`
  });
  return <>
    {
      unit !== DurationUnits.none && <StyledInput
            type="text"
            defaultValue={ value }
            onChange={ e => {
              const newValue = toInt(e.target.value);
              setValue(newValue);
              onChange(newValue && unit ? {unit: unit, value: newValue} : undefined);
            } }
            onKeyPress={ (event) => {
              if (!/\d/.test(event.key)) {
                event.preventDefault();
              }
            } }
        />
    }
    <Select
      isClearable
      isSearchable
      styles={ {
        ...SELECT_STYLES,
        control: (styles: CSSObjectWithLabel) => ({...styles, width: OPTION_WIDTH * 0.8}),
      } }
      onChange={ selected => {
        const newUnit = selected?.value;
        setUnit(newUnit);
        onChange(selected && value ? {unit: selected.value, value} : undefined);
      } }
      options={ Object.values(DurationUnits).map(formatUnitOption) }
      value={ selectedValue ? formatUnitOption(selectedValue.unit) : undefined }
    />
    {
      unit !== DurationUnits.none && <AgoLabel>ago</AgoLabel>
    }
  </>;
}
