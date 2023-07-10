import React from "react";
import styled from "styled-components";
import { Colorscheme } from "./Style";

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
  color: Color | Colorscheme;
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
}
