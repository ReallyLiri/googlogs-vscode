import { Audio, Grid } from "react-loader-spinner";
import React from "react";
import styled from "styled-components";
import { COLOR_MAIN } from "../style";

const Wrapper = styled.div<{ floating: boolean, size: number }>`
  ${
          ({floating, size}) => floating && `
  position: absolute;
  left: calc(50% - ${ size / 2 }px);
  top: calc(50% - ${ size / 2 }px);
          `
  };
  ${
          ({floating, size}) => !floating &&
                  `margin: 16px 0 16px calc(50% - ${ size / 2 }px);`
  };
`;

const Title = styled.div`
  margin-top: 20px;
  text-align: center;
  font-size: 16px;
  color: ${ COLOR_MAIN };
`;

type LoaderProps = {
  type: 'Audio' | 'Grid',
  title?: string
  floating: boolean,
  size: number
};

export default ({type, title, floating, size}: LoaderProps) => {
  const animation = (props: any) => type === 'Audio' ? <Audio { ...props }/> : <Grid { ...props }/>;
  return <Wrapper floating={ floating } size={ size }>
    {
      animation({height: size, width: size, color: COLOR_MAIN})
    }
    {
      title && <Title>{ title }</Title>
    }
  </Wrapper>;
};
