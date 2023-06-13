import React, { useCallback, useEffect, useState } from "react";
import { kicks_i, kicks_jltsz } from "../helpers/kicks";
import { tetrominos } from "../helpers/tetrominos";
import { boardSize } from "./Board";
import { CellData, Color } from "./Cell";

export default function Player() {
  const [bag, setBag] = useState(getRandomizedBag());
  const [nextBag, setNextBag] = useState(getRandomizedBag());
  const key = bag[0];
  const tetromino = { ...tetrominos[key] };

  const [player, setPlayer] = useState({
    pos: { x: 0, y: 0 },
    tetromino: {
      shape: key,
      grid: tetromino.grid,
      color: tetromino.color,
      orientation: 0,
    },
    merged: false,
  });

  useEffect(() => {
    resetPlayer();
  }, []);

  function getRandomizedBag() {
    return Object.keys(tetrominos)
      .map(key => ({
        key,
        sort: Math.random(),
      }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ key }) => key);
  }

  function updatePosition(pos: { x: number; y: number }, board: CellData[][]) {
    const [collided, shouldMerge] = testCollision(pos, board);
    if (collided) {
      if (shouldMerge) mergePiece();
      return;
    }

    setPlayer({
      ...player,
      pos: { x: player.pos.x + pos.x, y: player.pos.y + pos.y },
    });
  }

  function testCollision(
    pos: { x: number; y: number },
    board: CellData[][],
    tetromino?: number[][]
  ) {
    const playerBoard: CellData[][] = Array.from(Array(boardSize.height), () =>
      Array.from(
        Array<CellData>(boardSize.width).fill({
          filled: false,
          color: Color.Empty,
          transparent: false,
        })
      )
    );

    tetromino = tetromino === undefined ? player.tetromino.grid : tetromino;

    let shouldMerge = false;
    const outOfBounds = tetromino?.some((row, y) =>
      row.some((_, x) => {
        if (!tetromino?.[y][x]) return false;

        const newX = player.pos.x + x + pos.x;
        const newY = player.pos.y + y + pos.y;

        if (newY >= boardSize.height) {
          shouldMerge = true;
          return true;
        }

        if (newX < 0 || newX >= boardSize.width) return true;
        playerBoard[newY][newX] = {
          color: player.tetromino.color,
          filled: true,
          transparent: false,
        };
      })
    );

    if (outOfBounds) return [true, shouldMerge];

    const overlap = playerBoard
      .flat()
      .some((cell, i) => cell.filled && board.flat()[i].filled);

    if (overlap) {
      if (pos.y === 1) shouldMerge = true;
    }

    return [overlap, shouldMerge];
  }

  function getLowestPoint(board: CellData[][]) {
    for (let row = player.pos.y; row <= boardSize.height; row++) {
      if (testCollision({ x: 0, y: row - player.pos.y }, board)[0])
        return row - 1;
    }

    return boardSize.height - 1;
  }

  function rotate(dir: number) {
    // cant deep copy with fking js
    let tetromino = tetrominos[player.tetromino.shape].grid.map(inner =>
      inner.slice()
    );

    const newOrientation = (dir + player.tetromino.orientation + 4) % 4;

    switch (newOrientation) {
      case 1:
        tetromino = tetromino.map((_, index) =>
          tetromino.map(column => column[index])
        );
        tetromino = tetromino.map(row => row.reverse());

        break;

      case 2:
        tetromino.reverse();
        tetromino = tetromino.map(row => row.reverse());

        break;

      case 3:
        tetromino = tetromino.map((_, index) =>
          tetromino.map(column => column[index])
        );
        tetromino = tetromino.reverse();
        break;

      default:
        break;
    }

    return tetromino;
  }

  function rotatePlayer(dir: number, board: CellData[][]) {
    const tetromino = rotate(dir);

    let pos = { x: 0, y: 0 };
    if (testCollision({ x: 0, y: 0 }, board, tetromino)[0]) {
      const kicks = key === "I" ? kicks_i : kicks_jltsz;
      const kick_tests =
        kicks[player.tetromino.orientation][
          (player.tetromino.orientation + dir + 4) % 4
        ];
      const _pos = kick_tests.find(
        pos => !testCollision(pos, board, tetromino)[0]
      );
      if (!_pos) return;
      pos = _pos;
    }

    setPlayer({
      ...player,
      pos: {
        x: player.pos.x + pos.x,
        y: player.pos.y + pos.y,
      },
      tetromino: {
        ...player.tetromino,
        orientation: (player.tetromino.orientation + dir + 4) % 4,
        grid: tetromino,
      },
    });
  }

  function mergePiece() {
    setPlayer({
      ...player,
      merged: true,
    });
  }

  function resetPlayer() {
    const key = bag[0];
    const shape = { ...tetrominos[key] };
    bag.shift();

    if (bag.length === 0) {
      bag.push(...nextBag);
      setNextBag(getRandomizedBag());
    }

    setBag([...bag]);

    const tetromino = {
      shape: key,
      grid: shape.grid,
      color: shape.color,
      orientation: 0,
    };

    setPlayer({
      pos: {
        x: boardSize.width / 2 - Math.ceil(tetromino.grid[0].length / 2),
        y: 0,
      },
      merged: false,
      tetromino: {
        ...tetromino,
      },
    });
  }

  return [
    player,
    setPlayer,
    updatePosition,
    resetPlayer,
    rotatePlayer,
    bag,
    nextBag,
    getLowestPoint,
  ] as const;
}
