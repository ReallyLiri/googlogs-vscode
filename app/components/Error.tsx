import React from "react";
import styled from "styled-components";
import { COLOR_MAIN } from "../style";

const Wrapper = styled.div`
  position: absolute;
  left: 50%;
  top: calc(50% - 88px);
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
  color: ${ COLOR_MAIN };
`;

type ErrorProps = {
  error?: string,
};

export default ({error}: ErrorProps) => {
  return <Wrapper>
    <Emoji>💔</Emoji>
    <Message>{ error ?? "Something went wrong..." }</Message>
  </Wrapper>;
};
