import React from "react";
import styled from "styled-components";
import { Box } from "./Styles";

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

type NumberPickerProps = {
  value: number | undefined,
  setValue: (value: number | undefined) => void
};

export default ({value, setValue}: NumberPickerProps) => (
  <StyledInput
    type="text"
    defaultValue={ value }
    onChange={ e => setValue(toInt(e.target.value)) }
    onKeyPress={ (event) => {
      if (!/\d/.test(event.key)) {
        event.preventDefault();
      }
    } }
  />
);
