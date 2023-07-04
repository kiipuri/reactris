import React, { useEffect, useRef, useState } from "react";
import { Cell, CellData, Color } from "./Cell";
import styled from "styled-components";
import Player from "./Player";
import { tetrominos } from "../helpers/tetrominos";
import { useInterval } from "../hooks/useInterval";

export const boardSize = {
  width: 10,
  height: 22,
};

export const cellWidth = 35;

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
    setBag,
    nextBag,
    getLowestPoint,
    usedHold,
    setUsedHold,
    setMoveReset,
  ] = Player();

  const lowestPoint = getLowestPoint(board);

  board.forEach((row, y) =>
    row.forEach(cell => {
      if (y < 2) {
        cell.color = Color.Background;
        cell.transparent = false;
        return;
      }
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

  useInterval(() => {
    function drop() {
      updatePosition({ x: 0, y: 1 }, board);
    }

    drop();
  }, 900);

  const [heldKey, setHeldKey] = useState<React.KeyboardEvent | null>(null);
  const [heldKeys, setHeldKeys] = useState(new Set());

  const [delay, setDelay] = useState(133);

  const [keysSize, setKeysSize] = useState(heldKeys.size);
  useInterval(
    () => {
      function doMove(key: React.KeyboardEvent) {
        move(key);
        setDelay(10);
      }
      keysSize && heldKeys.has(heldKey?.code) && heldKey
        ? doMove(heldKey)
        : setDelay(133);
    },
    keysSize ? delay : null
  );

  const stopRepeat = (keycode: string) => {
    heldKeys.delete(keycode);
    setHeldKeys(heldKeys);
    setKeysSize(heldKeys.size);
    setDelay(133);
  };

  const [heldPiece, setHeldPiece] = useState<string | null>(null);

  function holdPiece() {
    setUsedHold(true);
    if (!heldPiece) {
      setHeldPiece(player.tetromino.shape);
      resetPlayer();
    } else {
      const currentPiece = player.tetromino.shape;
      setMoveReset(0);
      setPlayer({
        ...player,
        tetromino: {
          ...tetrominos[heldPiece],
          shape: heldPiece,
          orientation: 0,
        },
        pos: {
          x:
            boardSize.width / 2 -
            Math.ceil(player.tetromino.grid[0].length / 2),
          y: 0,
        },
      });
      setHeldPiece(currentPiece);
    }
  }

  const move = (key: React.KeyboardEvent) => {
    if (key.repeat) return;

    const keycode = key.code;
    switch (keycode) {
      case "ArrowLeft":
        updatePosition({ x: -1, y: 0 }, board);
        setHeldKeys(heldKeys.add(keycode));
        setKeysSize(heldKeys.size);
        setHeldKey(key);
        setDelay(133);
        break;

      case "ArrowRight":
        updatePosition({ x: 1, y: 0 }, board);
        setHeldKeys(heldKeys.add(keycode));
        setKeysSize(heldKeys.size);
        setHeldKey(key);
        setDelay(133);
        break;

      case "ArrowDown":
        updatePosition({ x: 0, y: 1 }, board);
        setHeldKeys(heldKeys.add(keycode));
        setKeysSize(heldKeys.size);
        setHeldKey(key);
        setDelay(20);
        break;

      case "Space":
        player.tetromino.grid.forEach((row, y) =>
          row.forEach((cell, x) => {
            if (!cell) return;

            board[lowestPoint + y][player.pos.x + x] = {
              color: player.tetromino.color,
              filled: true,
              transparent: false,
            };
          })
        );
        setUsedHold(false);
        resetPlayer();
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

      case "ShiftLeft":
        if (usedHold) return;
        holdPiece();
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

  function renderHoldPiece() {
    if (!heldPiece) return;
    return (
      <StyledNextPiece
        width={tetrominos[heldPiece].grid.length}
        height={cellWidth}>
        {heldPiece &&
          tetrominos[heldPiece].grid.map(row => {
            if (!row.some(cell => cell)) return;
            return row.map((cell, key) => {
              return (
                <Cell
                  cellColor={cell ? tetrominos[heldPiece].color : Color.Empty}
                  key={key}
                  width={cellWidth}
                  style={
                    cell
                      ? {
                          border: "1px solid #606060",
                          width: cellWidth + 2 + "px",
                          margin: "-1px",
                          boxSizing: "border-box",
                        }
                      : {}
                  }
                />
              );
            });
          })}
      </StyledNextPiece>
    );
  }

  return (
    <>
      <div
        style={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          justifyItems: "center",
          alignItems: "center",
        }}>
        <GameContainer>
          <HoldPieceContainer height={cellWidth}>
            {renderHoldPiece()}
          </HoldPieceContainer>
          <StyledBoard
            width={boardSize.width}
            ref={divRef}
            tabIndex={0}
            style={{ marginTop: `-${cellWidth * 2}px` }}
            onKeyUp={e => stopRepeat(e.code)}
            onKeyDown={e => move(e)}>
            {board.map((row, y) => {
              return row.map((cell, key) => {
                return (
                  <Cell
                    cellColor={cell.color}
                    width={cellWidth}
                    transparent={cell.transparent}
                    key={key}
                    style={
                      cell.color !== Color.Empty &&
                      cell.color !== Color.Background
                        ? {
                            border: "1px solid #606060",
                            width: cellWidth + 2 + "px",
                            marginTop: "-1px",
                            marginLeft: "-1px",
                            boxSizing: "border-box",
                            zIndex: 10,
                          }
                        : {
                            border:
                              y >= 2
                                ? "1px solid #606060"
                                : "1px solid " + Color.Background,
                            marginTop: "-1px",
                            marginLeft: "-1px",
                          }
                    }
                  />
                );
              });
            })}
          </StyledBoard>
          <NextPieceContainer height={cellWidth}>
            {nextPieces.map((shape, i) => {
              return (
                <StyledNextPiece
                  width={tetrominos[shape].grid.length}
                  height={cellWidth}
                  key={i}>
                  {tetrominos[shape].grid.map(row => {
                    if (!row.some(cell => cell)) return;
                    return row.map((cell, key) => {
                      return (
                        <Cell
                          cellColor={
                            cell ? tetrominos[shape].color : Color.Empty
                          }
                          key={key}
                          width={cellWidth}
                          style={
                            cell
                              ? {
                                  border: "1px solid #606060",
                                  width: cellWidth + 2 + "px",
                                  margin: "-1px",
                                  boxSizing: "border-box",
                                }
                              : {}
                          }
                        />
                      );
                    });
                  })}
                </StyledNextPiece>
              );
            })}
          </NextPieceContainer>
        </GameContainer>
      </div>
    </>
  );
}

const StyledBoard = styled.div<{ width: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.width}, auto);
  width: ${props => cellWidth * props.width}px;
  background-color: #606060;
  float: left;
  width: auto;
  outline: none;
`;

const StyledNextPiece = styled.div<{ height: number; width: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.width}, auto);
  width: ${props => props.height * props.width}px;
  margin: 10px 10px;
  grid-gap: 1px;
`;

const NextPieceContainer = styled.div<{ height: number }>`
  width: ${cellWidth * 4}px;
  height: ${props => props.height * 10 + 100}px;
  justify-content: center;
  justify-items: center;
  align-items: center;
  display: grid;
  grid-template-rows: repeat(5, 20%);
  background-color: ${Color.Empty};
  padding: 20px;
`;

const HoldPieceContainer = styled.div<{ height: number }>`
  width: ${cellWidth * 4}px;
  height: ${props => props.height * 2}px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${Color.Empty};
  padding: 20px;
`;

const GameContainer = styled.div`
  display: flex;
  justify-items: center;
`;
