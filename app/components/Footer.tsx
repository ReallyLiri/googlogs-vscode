import styled from "styled-components";
import { COLOR_DEBUG, COLOR_LIGHT, COLOR_MAIN } from "../style";
import React from "react";
import Switch from "react-switch";

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

const StyledSwitch = styled(Switch)`
  margin-left: 8px;
`;

type FooterProps = {
  className?: string,
  webUrl: string,
  entriesCount: number,
  dedupCount: number,
  hasMore: boolean,
  dedup: boolean,
  toggleDedup: () => void,
};

export const Footer = ({className, webUrl, entriesCount, dedupCount, hasMore, dedup, toggleDedup}: FooterProps) => (
  <Line className={ className }>
    <div>Showing <Highlighted>{ dedup ? `${ dedupCount } (${ entriesCount })` : entriesCount }</Highlighted>{ hasMore ? " / ?" : "" } results</div>
    <Separator/>
    <StyledAnchor href={ webUrl } target="_blank">Open in web</StyledAnchor>
    <Separator/>
    <div>Deduplicate</div>
    <StyledSwitch
      onChange={ () => toggleDedup() }
      checked={ dedup }
      height={ 16 }
      width={ 32 }
      checkedIcon={ false }
      uncheckedIcon={ false }
      offColor={ COLOR_DEBUG }
      onColor={ COLOR_MAIN }
    />
  </Line>
);
