import React, { useEffect, useRef, useState } from "react";
import { Cell, CellData, Color } from "./Cell";
import styled from "styled-components";
import Player from "./Player";
import { tetrominos } from "../helpers/tetrominos";
import { useInterval } from "../hooks/useInterval";
import PropTypes from "prop-types";
import {
  Colorscheme,
  PlayerInfo,
  StyledButton,
  UITextPrimary,
  UITextSecondary,
} from "./Style";
import { Base64 } from "js-base64";
import { Pages } from "./front-page/FrontPage";

export const boardSize = {
  width: 10,
  height: 22,
};

export const cellWidth = 35;

enum GameState {
  Playing,
  Ended,
}

export default function Board({
  setPage,
}: {
  setPage: (...args: Pages[]) => void;
}) {
  const [board, setBoard] = useState(
    Array.from(Array(boardSize.height), () =>
      Array.from(
        Array<CellData>(boardSize.width).fill({
          filled: false,
          color: Colorscheme.c600,
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
    bagRef,
    nextBag,
    getRandomizedBag,
    getLowestPoint,
    usedHold,
    setUsedHold,
    setMoveReset,
  ] = Player();

  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const lowestPoint = getLowestPoint(board);
  const [gameState, setGameState] = useState(GameState.Playing);

  board.forEach((row, y) =>
    row.forEach(cell => {
      if (y < 2) {
        cell.color = Colorscheme.cbase;
        cell.transparent = false;
        return;
      }
      if (cell.filled) return;
      cell.color = Colorscheme.c600;
      cell.transparent = false;
    })
  );

  player.tetromino.grid.forEach((playerRow, y) => {
    playerRow.forEach((playerCell, x) => {
      if (!playerCell) return;

      if (lowestPoint < 0) return;
      board[lowestPoint + y][player.pos.x + x] = {
        color: player.tetromino.color,
        filled: false,
        transparent: true,
      };
    });
  });

  let rowsToClear = 0;
  board.forEach((row, y) => {
    const filledRow = row.every(cell => cell.filled);
    if (filledRow) {
      rowsToClear++;
      row.forEach((_, x) => {
        board[y][x] = {
          color: Colorscheme.c600,
          filled: false,
          transparent: false,
        };
      });

      board.splice(0, 0, board.splice(y, 1)[0]);
    }
  });

  useEffect(() => {
    let _score = 0;
    switch (rowsToClear) {
      case 1:
        _score = 100;
        break;

      case 2:
        _score = 300;
        break;

      case 3:
        _score = 500;
        break;

      case 4:
        _score = 800;
        break;

      default:
        break;
    }
    setScore(score + _score);
  });

  player.tetromino.grid.forEach((row, y) =>
    row.forEach((cell, x) => {
      if (!cell) return;

      if (player.pos.y + y < 2 && player.merged) setGameState(GameState.Ended);
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

  useInterval(
    () => {
      function timer() {
        setTime(time + 30);
      }

      timer();
    },
    gameState === GameState.Playing ? 30 : null
  );

  useInterval(
    () => {
      function drop() {
        updatePosition({ x: 0, y: 1 }, board);
      }

      drop();
    },
    gameState === GameState.Playing ? 900 : null
  );

  function restartGame() {
    setBoard(
      Array.from(Array(boardSize.height), () =>
        Array.from(
          Array<CellData>(boardSize.width).fill({
            filled: false,
            color: Colorscheme.c600,
            transparent: false,
          })
        )
      )
    );

    bagRef.current = getRandomizedBag();
    resetPlayer();
    setTime(0);
    setScore(0);
    setGameState(GameState.Playing);
    divRef.current?.focus();
  }

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
                  cellColor={
                    cell ? tetrominos[heldPiece].color : Colorscheme.c600
                  }
                  key={key}
                  width={cellWidth}
                  style={
                    cell
                      ? {
                          border: `1px solid ${Colorscheme.c800}`,
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

  const resultRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (gameState === GameState.Ended) {
      resultRef.current?.focus();
      divRef.current?.blur();
      const username = sessionStorage.getItem("username");
      const password = sessionStorage.getItem("password");
      if (username && password) {
        const auth = Base64.encode(
          `${sessionStorage.getItem("username")}:${sessionStorage.getItem(
            "password"
          )}`
        );

        const reqOpts = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + auth,
          },
          body: JSON.stringify({
            userId: 0,
            playerScore: score,
          }),
        };

        fetch("http://localhost:5267/Score", reqOpts).then(res => {
          console.log(res);
        });
      }
    }
  }, [gameState]);

  return (
    <>
      <div
        ref={resultRef}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)",
          position: "absolute",
          zIndex: "100",
          display: gameState === GameState.Ended ? "flex" : "none",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <StyledButton onClick={() => restartGame()}>Restart</StyledButton>
        <StyledButton onClick={() => setPage(Pages.FrontPage)}>
          Go Back
        </StyledButton>
      </div>
      <div
        style={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          justifyItems: "center",
          alignItems: "center",
        }}>
        <GameContainer>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}>
            <HoldPieceContainer height={cellWidth}>
              {renderHoldPiece()}
            </HoldPieceContainer>
            <div>
              <PlayerInfo>
                <UITextSecondary>Score</UITextSecondary>
                <UITextPrimary>{score}</UITextPrimary>
              </PlayerInfo>
              <PlayerInfo>
                <UITextSecondary>Time</UITextSecondary>
                <UITextPrimary>
                  {new Date(time).toISOString().slice(14, -1).slice(0, -1)}
                </UITextPrimary>
              </PlayerInfo>
            </div>
          </div>
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
                      cell.color !== Colorscheme.c600 &&
                      cell.color !== Colorscheme.cbase
                        ? {
                            border: `1px solid ${Colorscheme.c800}`,
                            width: cellWidth + 2 + "px",
                            marginTop: "-1px",
                            marginLeft: "-1px",
                            boxSizing: "border-box",
                            zIndex: 10,
                          }
                        : {
                            border:
                              y >= 2
                                ? `1px solid ${Colorscheme.c800}`
                                : "1px solid " + Colorscheme.cbase,
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
                            cell ? tetrominos[shape].color : Colorscheme.c600
                          }
                          key={key}
                          width={cellWidth}
                          style={
                            cell
                              ? {
                                  border: `1px solid ${Colorscheme.c800}`,
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

Board.propTypes = {
  setPage: PropTypes.func,
};

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
  background-color: ${Colorscheme.c600};
  padding: 20px;
`;

const HoldPieceContainer = styled.div<{ height: number }>`
  width: ${cellWidth * 4}px;
  height: ${props => props.height * 2}px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${Colorscheme.c600};
  padding: 20px;
  align-self: end;
`;

const GameContainer = styled.div`
  display: flex;
  justify-items: center;
`;
