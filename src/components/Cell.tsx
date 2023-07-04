import React from "react";
import styled from "styled-components";

export const Cell = styled.div<{
  transparent?: boolean;
  width: number;
  cellColor: string;
}>`
  background-color: ${props =>
    props.cellColor + (props.transparent ? "40" : "ff")};
  aspect-ratio: 1 / 1;
  width: ${props => props.width}px;
`;

export type CellData = {
  filled: boolean;
  color: Color;
  transparent: boolean;
};

export enum Color {
  Cyan = "#00ffff",
  Blue = "#0000ff",
  Orange = "#ffa500",
  Yellow = "#ffff00",
  Green = "#008000",
  Purple = "#800080",
  Red = "#ff0000",
  Empty = "#808080",
  Background = "#ffffff",
  // Cyan = "cyan",
  // Blue = "blue",
  // Orange = "orange",
  // Yellow = "yellow",
  // Green = "green",
  // Purple = "purple",
  // Red = "red",
  // Empty = "#808080",
  // Background = "#ffffff",
}
