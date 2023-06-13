import React, { useEffect, useRef, useState } from "react";
import { Cell, CellData, Color } from "./Cell";
import styled from "styled-components";
import Player from "./Player";
import { tetrominos } from "../helpers/tetrominos";

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
          transparent: false,
        })
      )
    )
  );

  const [
    player,
    setPlayer,
    updatePosition,
    resetPlayer,
    rotatePlayer,
    bag,
    nextBag,
    getLowestPoint,
  ] = Player();

  const lowestPoint = getLowestPoint(board);

  board.forEach(row =>
    row.forEach(cell => {
      if (cell.filled) return;
      cell.color = Color.Empty;
      cell.transparent = false;
    })
  );

  player.tetromino.grid.forEach((playerRow, y) => {
    playerRow.forEach((playerCell, x) => {
      if (!playerCell) return;

      board[lowestPoint + y][player.pos.x + x] = {
        color: player.tetromino.color,
        filled: false,
        transparent: true,
      };
    });
  });

  player.tetromino.grid.forEach((row, y) =>
    row.forEach((cell, x) => {
      if (!cell) return;

      board[player.pos.y + y][player.pos.x + x] = {
        color: player.tetromino.color,
        filled: player.merged,
        transparent: false,
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

  function useInterval(callback: any, delay: number | null) {
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
      // updatePosition({ x: 0, y: 1 }, board);
    }

    drop();
  }, 500);

  const [delay, setDelay] = useState(133);
  const keyIsHeld = Object.values(heldKeys).some(key => key);
  useInterval(
    () => {
      function doMove(key: React.KeyboardEvent) {
        move(key);
        setDelay(20);
      }

      if (Object.values(heldKeys).some(key => key) && heldKey) doMove(heldKey);
    },
    keyIsHeld ? delay : null
  );

  const stopRepeat = (keycode: string) => {
    heldKeys[keycode] = false;
    setHeldKeys(heldKeys);
    setDelay(133);
  };

  const move = (key: React.KeyboardEvent) => {
    if (key.repeat) return;

    const keycode = key.code;
    switch (keycode) {
      case "ArrowLeft":
        updatePosition({ x: -1, y: 0 }, board);
        heldKeys[keycode] = true;
        setHeldKeys(heldKeys);
        setHeldKey(key);
        break;

      case "ArrowRight":
        updatePosition({ x: 1, y: 0 }, board);
        heldKeys[keycode] = true;
        setHeldKeys(heldKeys);
        setHeldKey(key);
        break;

      case "ArrowDown":
        updatePosition({ x: 0, y: 1 }, board);
        heldKeys[keycode] = true;
        setHeldKeys(heldKeys);
        setHeldKey(key);
        setDelay(20);
        break;

      case "ArrowUp":
        updatePosition({ x: 0, y: -1 }, board);
        break;

      case "KeyA":
        rotatePlayer(2, board);
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

  const [nextPieces, setNextPieces] = useState<string[]>([]);
  useEffect(() => {
    const _nextPieces = [];
    _nextPieces.push(...bag.slice(0, 5));
    _nextPieces.push(...nextBag.slice(0, 5 - _nextPieces.length));
    setNextPieces(_nextPieces);
  }, [bag]);

  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (divRef.current) {
      divRef.current.focus();
    }
  }, []);

  return (
    <>
      <StyledBoard
        width={boardSize.width}
        ref={divRef}
        tabIndex={0}
        onKeyUp={e => stopRepeat(e.code)}
        onKeyDown={e => move(e)}>
        {board.map(row => {
          return row.map((cell, key) => {
            return (
              <Cell
                color={cell.color}
                transparent={cell.transparent}
                key={key}
              />
            );
          });
        })}
      </StyledBoard>
      <div>
        {nextPieces.map((shape, i) => {
          return (
            <StyledNextPiece
              width={tetrominos[shape].grid.length}
              height={20}
              key={i}>
              {tetrominos[shape].grid.map(row => {
                return row.map((cell, key) => {
                  return (
                    <Cell
                      color={cell ? tetrominos[shape].color : Color.Empty}
                      key={key}
                    />
                  );
                });
              })}
            </StyledNextPiece>
          );
        })}
      </div>
    </>
  );
}

const StyledBoard = styled.div<{ width: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.width}, auto);
  width: ${props => 50 * props.width}px;
  border: 2px solid red;
  grid-gap: 1px;
  background-color: #606060;
  float: left;
`;

const StyledNextPiece = styled.div<{ height: number; width: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.width}, auto);
  width: ${props => props.height * props.width}px;
  border: 2px solid red;
`;
