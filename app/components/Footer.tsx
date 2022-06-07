import styled from "styled-components";
import { COLOR_LIGHT, COLOR_MAIN } from "../style";
import React from "react";

const StyledAnchor = styled.a`
  color: ${ COLOR_LIGHT };
  :hover {
    color: ${ COLOR_MAIN };
  }
`;

const Highlighted = styled.span`
  color: ${ COLOR_MAIN };
`;

const SeparatorStyle = styled.div`
  color: ${ COLOR_MAIN };
  padding: 0 8px;
  font-size: 16px;
`;

const Separator = () => <SeparatorStyle>•</SeparatorStyle>;

const Line = styled.div<{ isFirst?: boolean }>`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`;

type FooterProps = {
  className?: string,
  webUrl: string,
  entriesCount: number,
  hasMore: boolean
};

export const Footer = ({className, webUrl, entriesCount, hasMore}: FooterProps) => (
  <Line className={ className }>
    <div>Showing <Highlighted>{ entriesCount }</Highlighted>{ hasMore ? "/?" : "" } results</div>
    <Separator/>
    <StyledAnchor href={ webUrl } target="_blank">Open in web</StyledAnchor>
  </Line>
);
