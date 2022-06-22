import React from "react";
import styled from "styled-components";
import { Box } from "./Styles";
import { COLOR_MAIN } from "../../style";
import Tippy from "@tippyjs/react";
import 'tippy.js/dist/tippy.css';

const Anchor = styled.a`
  ${ Box };
  background-color: ${ COLOR_MAIN };
  border-radius: 50%;
  color: white;
  height: 24px;
  width: 24px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  padding: 10px;
  margin-left: 4px;
  user-select: none;
  cursor: pointer;
`;

type HintProps = {
  content: string;
};

export default ({content}: HintProps) => {
  return (
    <>
      <Tippy content={ content } interactive placement='bottom-end'>
        <Anchor data-tip='hover on me will keep the tooltip'>?</Anchor>
      </Tippy>
    </>
  );
};
