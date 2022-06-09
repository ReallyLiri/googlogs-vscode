import styled from "styled-components";
import TagsInput from "react-tagsinput";
import { Box, InputStyle, OPTION_WIDTH } from "./Styles";
import { COLOR_MAIN } from "../../style";
import React from "react";

export const StyledTagsInput = styled(TagsInput)`
  ${ InputStyle };
  width: ${ OPTION_WIDTH }px;
  background-color: white;
  padding: 1px;
  height: fit-content;
  display: flex;
  white-space: nowrap;
  overflow: auto;

  .react-tagsinput-input {
    padding: 8px;
    border: unset;
  }

  .react-tagsinput-tag {
    ${ Box };
    padding: 4px;
    margin: 2px;
    color: ${ COLOR_MAIN };
    cursor: default;

    .react-tagsinput-remove {
      ::before {
        content: "x";
        padding-left: 4px
      }

      cursor: pointer;
      display: inline-flex;
      height: 16px;
      width: 17px;
      background-color: ${ COLOR_MAIN };
      color: white;
      margin-left: 4px;
      border-radius: 4px;
    }
  }
`;
