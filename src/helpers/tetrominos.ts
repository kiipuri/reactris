import { Color } from "../components/Cell";

type Tetrominos = {
  // [key: string]: number[][];
  [key: string]: {
    grid: number[][];
    color: Color;
  };
};

export const tetrominos: Tetrominos = {
  I: {
    grid: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: Color.Cyan,
  },
  J: {
    grid: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: Color.Blue,
  },
  L: {
    grid: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: Color.Orange,
  },
  O: {
    grid: [
      [1, 1],
      [1, 1],
    ],
    color: Color.Yellow,
  },
  S: {
    grid: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: Color.Green,
  },
  Z: {
    grid: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: Color.Red,
  },
  T: {
    grid: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: Color.Purple,
  },
};
