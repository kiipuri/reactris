import React from "react";
import styled from "styled-components";

export const Cell = styled.div`
  background-color: ${props => props.color};
  height: 50px;
  width: 50px;
`;

export type CellData = {
  filled: boolean;
  color: Color;
};

export enum Color {
  Cyan = "cyan",
  Blue = "blue",
  Orange = "orange",
  Yellow = "yellow",
  Green = "green",
  Purple = "purple",
  Red = "red",
  Empty = "gray",
}
