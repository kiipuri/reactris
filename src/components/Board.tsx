import React, { useEffect, useRef, useState } from "react";
import { Cell, CellData, Color } from "./Cell";
import styled from "styled-components";
import Player from "./Player";

export const boardSize = {
  width: 10,
  height: 15,
};

export default function Board() {
  const [board, setBoard] = useState(
    Array.from(Array(boardSize.height), () =>
      Array.from(
        Array<CellData>(boardSize.width).fill({
          filled: false,
          color: Color.Empty,
        })
      )
    )
  );

  const [player, setPlayer, updatePosition, resetPlayer, rotatePlayer] =
    Player();

  board.forEach(row =>
    row.forEach(cell => {
      if (cell.filled) return;
      cell.color = Color.Empty;
    })
  );

  player.tetromino.grid.forEach((row, y) =>
    row.forEach((cell, x) => {
      if (!cell) return;

      board[player.pos.y + y][player.pos.x + x] = {
        color: player.tetromino.color,
        filled: player.merged,
      };
    })
  );

  if (player.merged) {
    resetPlayer();
  }

  const [heldKey, setHeldKey] = useState<React.KeyboardEvent | null>(null);
  type keyHeldType = {
    [key: string]: boolean;
  };
  const [heldKeys, setHeldKeys] = useState<keyHeldType>({});

  function useInterval(callback: any, delay: number) {
    const savedCallback = useRef<typeof callback>();
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        const id = setInterval(tick, delay);
        return () => {
          clearInterval(id);
        };
      }
    }, [delay]);
  }

  useInterval(() => {
    function drop() {
      updatePosition({ x: 0, y: 1 }, board);
    }

    drop();
  }, 500);

  useInterval(
    () => {
      function doMove(key: React.KeyboardEvent) {
        move(key);
      }

      if (Object.values(heldKeys).some(key => key) && heldKey) doMove(heldKey);
    },
    Object.values(heldKeys).some(key => key) ? 10 : 0
  );

  const stopRepeat = (keycode: string) => {
    heldKeys[keycode] = false;
    setHeldKeys(heldKeys);
  };

  const move = (key: React.KeyboardEvent) => {
    if (key.repeat) return;

    const keycode = key.code;
    switch (keycode) {
      case "ArrowLeft":
        updatePosition({ x: -1, y: 0 }, board);
        setHeldKey(key);
        heldKeys[keycode] = true;
        setHeldKeys(heldKeys);
        break;

      case "ArrowRight":
        updatePosition({ x: 1, y: 0 }, board);
        heldKeys[keycode] = true;
        setHeldKey(key);
        break;
      case "ArrowDown":
        updatePosition({ x: 0, y: 1 }, board);
        heldKeys[keycode] = true;
        setHeldKey(key);
        break;

      case "ArrowUp":
        updatePosition({ x: 0, y: -1 }, board);
        break;

      case "KeyZ":
        rotatePlayer(-1, board);
        break;

      case "KeyX":
        rotatePlayer(1, board);
        break;

      // case "KeyR":
      //   randomTetromino();
      //   break;

      default:
        break;
    }
  };

  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (divRef.current) {
      divRef.current.focus();
    }
  }, []);

  return (
    <StyledBoard
      width={boardSize.width}
      ref={divRef}
      tabIndex={0}
      onKeyUp={e => stopRepeat(e.code)}
      onKeyDown={e => move(e)}>
      {board.map(row => {
        return row.map((cell, key) => {
          return <Cell color={cell.color} key={key} />;
        });
      })}
    </StyledBoard>
  );
}

const StyledBoard = styled.div<{ width: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.width}, auto);
  width: ${props => 50 * props.width}px;
  border: 2px solid red;
`;
