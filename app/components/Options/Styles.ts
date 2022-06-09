import { CSSObjectWithLabel } from "react-select";
import { COLOR_DARK, COLOR_MAIN } from "../../style";
import { css } from "styled-components";

export const OPTION_WIDTH = 360;

export const SELECT_STYLES = {
  control: (styles: CSSObjectWithLabel) => ({...styles, width: OPTION_WIDTH}),
  menu: (styles: CSSObjectWithLabel) => ({...styles, width: OPTION_WIDTH}),
  singleValue: (styles: CSSObjectWithLabel) => ({...styles, color: COLOR_MAIN}),
  option: (styles: CSSObjectWithLabel) => ({...styles, color: COLOR_DARK}),
};

export const Box = css`
  border-radius: 4px;
  border: 1px solid hsl(0, 0%, 80%);
`;

export const InputStyle = css`
  ${ Box };
  height: 20px;
  text-align: left;
`;
