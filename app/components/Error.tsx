import React from "react";
import styled from "styled-components";
import { COLOR_ERROR } from "../style";
import { useWindowHeight } from "@react-hook/window-size";
import { Box } from "./Options/Styles";

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

const RetryButton = styled.div`
  ${ Box };
  cursor: pointer;
  margin-top: 20px;
  height: 24px;
  width: 64px;
  background-color: ${ COLOR_ERROR };
  color: white;
  text-align: center;
  padding-top: 6px;
`;

type ErrorProps = {
  error?: string,
  retry: () => void,
};

export default ({error, retry}: ErrorProps) => {
  const windowHeight = useWindowHeight();
  return <Wrapper height={ windowHeight }>
    <Emoji title=":(">💔</Emoji>
    <Message>{ error ?? "Something went wrong..." }</Message>
    <RetryButton title="Retry" onClick={retry}>Retry</RetryButton>
  </Wrapper>;
};
