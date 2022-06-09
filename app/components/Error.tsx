import React from "react";
import styled from "styled-components";
import { COLOR_ERROR } from "../style";
import { useWindowHeight } from "@react-hook/window-size";

const Wrapper = styled.div<{ height: number }>`
  height: ${ ({height}) => height }px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
  flex-direction: column;
`;

const Emoji = styled.div`
  margin-top: 20px;
  text-align: center;
  font-size: 32px;
`;

const Message = styled.div`
  margin-top: 20px;
  text-align: center;
  font-size: 16px;
  color: ${ COLOR_ERROR };
`;

type ErrorProps = {
  error?: string,
};

export default ({error}: ErrorProps) => {
  const windowHeight = useWindowHeight();
  return <Wrapper height={ windowHeight }>
    <Emoji>💔</Emoji>
    <Message>{ error ?? "Something went wrong..." }</Message>
  </Wrapper>;
};
