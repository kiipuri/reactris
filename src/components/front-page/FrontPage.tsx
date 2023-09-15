import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Board from "../Board";
import { Colorscheme, StyledButton, StyledInput, StyledText } from "../Style";

export enum Pages {
  FrontPage,
  Login,
  Game,
  Highscores,
}

export default function FrontPage() {
  const [logged, setLogged] = useState(false);
  const [page, setPage] = useState(Pages.FrontPage);

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  function setCredentials() {
    if (!usernameRef.current?.value || !passwordRef.current?.value) return;
    sessionStorage.setItem("username", usernameRef.current.value);
    sessionStorage.setItem("password", passwordRef.current.value);
  }

  function handleLogin() {
    if (!usernameRef.current?.value || !passwordRef.current?.value) {
      alert("Need username and password");
      return;
    }

    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    const reqOpts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, hashedPassword: password }),
    };

    fetch("http://localhost:5267/User/login", reqOpts).then(res => {
      if (res.ok) {
        setCredentials();
        setLogged(true);
        setPage(Pages.Game);
      } else alert("Couldn't log in");
    });
  }

  function handleRegister() {
    if (!usernameRef.current?.value || !passwordRef.current?.value) {
      alert("Need username and password");
      return;
    }

    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    const reqOpts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, hashedPassword: password }),
    };

    fetch("http://localhost:5267/User/register", reqOpts).then(res => {
      if (res.ok) {
        alert("Registered successfully");
      } else alert("Couldn't register");
    });
  }

  function handlePlayGuest() {
    setLogged(false);
    setPage(Pages.Game);
  }

  function renderLogin() {
    return (
      <>
        <StyledInput placeholder="Username" ref={usernameRef} />
        <StyledInput placeholder="Password" ref={passwordRef} />
        <div>
          <StyledButton onClick={() => setPage(Pages.FrontPage)}>
            {"Go back"}
          </StyledButton>
          <StyledButton onClick={() => handleLogin()}>{"Login"}</StyledButton>
        </div>
        <StyledButton onClick={() => handleRegister()}>
          {"Register"}
        </StyledButton>
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
        <StyledButton onClick={() => setPage(Pages.Highscores)}>
          Highscores
        </StyledButton>
      </>
    );
  }

  const [highscores, setHighscores] = useState([]);
  function fetchHighscores() {
    const reqOpts = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    fetch("http://localhost:5267/Score/Highscores", reqOpts).then(res => {
      if (res.ok) {
        res.json().then(scores => {
          setHighscores(scores);
        });
      } else alert("Error occured");
    });
  }

  useEffect(() => {
    if (page == Pages.Highscores) fetchHighscores();
  }, [page]);

  function renderPage() {
    switch (page) {
      case Pages.FrontPage:
        return renderFront();

      case Pages.Login:
        return renderLogin();

      case Pages.Game:
        return <Board setPage={setPage} />;

      case Pages.Highscores:
        const jsx = (
          <>
            <BackButton />
            <Table>
              <colgroup>
                <col style={{ width: "50%" }} />
                <col style={{ width: "50%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th>
                    <StyledText>User</StyledText>
                  </th>
                  <th>
                    <StyledText>Score</StyledText>
                  </th>
                </tr>
              </thead>
              <tbody>
                {highscores.map((score: any) => {
                  return (
                    <tr key={score.id}>
                      <td>
                        <StyledText>{score.user.username}</StyledText>
                      </td>
                      <td>
                        <StyledText>{score.playerScore}</StyledText>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </>
        );
        return jsx;

      default:
        break;
    }
  }

  function BackButton() {
    return (
      <StyledButton onClick={() => setPage(Pages.FrontPage)}>
        Go Back
      </StyledButton>
    );
  }

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

const Table = styled.table`
  text-align: left;
  min-width: 30rem;
  table-layout: fixed;
  border: 1px solid ${Colorscheme.c700};
  padding: 2rem;
`;
