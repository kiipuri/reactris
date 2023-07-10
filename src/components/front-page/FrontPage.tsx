import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Board from "../Board";
import { Colorscheme, StyledButton, StyledInput, StyledText } from "../Style";

enum Pages {
  FrontPage,
  Login,
  Game,
}

export default function FrontPage() {
  const [page, setPage] = useState(Pages.FrontPage);

  const usernameRef = useRef<HTMLInputElement>(null);

  function handlePlayUser() {
    if (!usernameRef.current?.value) {
      return;
    }

    setPage(Pages.Game);
  }

  function handlePlayGuest() {
    setPage(Pages.Game);
  }

  function renderLogin() {
    return (
      <>
        <StyledInput placeholder="Username" ref={usernameRef} />
        <div>
          <StyledButton onClick={() => setPage(Pages.FrontPage)}>
            {"Go back"}
          </StyledButton>
          <StyledButton onClick={() => handlePlayUser()}>{"Play"}</StyledButton>
        </div>
      </>
    );
  }

  function renderFront() {
    return (
      <>
        <StyledButton onClick={() => handlePlayGuest()}>
          Play as Guest
        </StyledButton>
        <StyledButton onClick={() => setPage(Pages.Login)}>
          Play as User
        </StyledButton>
      </>
    );
  }

  function renderPage() {
    switch (page) {
      case Pages.FrontPage:
        return renderFront();

      case Pages.Login:
        return renderLogin();

      case Pages.Game:
        return <Board />;

      default:
        break;
    }
  }

  // <FrontPageDiv>{showLogin ? renderLogin() : renderFront()}</FrontPageDiv>
  return (
    <>
      <FrontPageDiv>{renderPage()}</FrontPageDiv>
    </>
  );
}

const FrontPageDiv = styled.div`
  background-color: ${Colorscheme.cbase};
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
