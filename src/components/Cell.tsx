import React from "react";
import styled from "styled-components";

export const Cell = styled.div<{ transparent?: boolean }>`
  background-color: ${props => props.color};
  aspect-ratio: 1 / 1;
  opacity: ${props => (props.transparent ? 0.25 : 1)};
`;

export type CellData = {
  filled: boolean;
  color: Color;
  transparent: boolean;
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
