import styled from "styled-components";

// export const Colorscheme = {
//   c50: "#fafafa",
//   c100: "#f5f5f5",
//   c200: "#eeeeee",
//   c300: "#e0e0e0",
//   c400: "#bdbdbd",
//   c500: "#9e9e9e",
//   c600: "#757575",
//   c700: "#616161",
//   c800: "#424242",
//   c900: "#212121",
//   cbase: "#121212",
// };

export enum Colorscheme {
  c50 = "#f7f7f7",
  c100 = "#e1e1e1",
  c200 = "#cfcfcf",
  c300 = "#b1b1b1",
  c400 = "#9e9e9e",
  c500 = "#7e7e7e",
  c600 = "#626262",
  c700 = "#515151",
  c800 = "#3b3b3b",
  c900 = "#222222",
  cbase = "#121212",
}

export const StyledButton = styled.button`
  background-color: ${Colorscheme.c900};
  color: ${Colorscheme.c200};
  padding: 2rem 4rem;
  font-size: 3rem;
  border: none;
  border-radius: 0.5rem;
  margin: 1rem;
  &:hover {
    background-color: ${Colorscheme.c800};
    cursor: pointer;
  }
`;

export const StyledInput = styled.input`
  padding: 1rem;
  font-size: 2rem;
  border: none;
  border-radius: 0.5rem;
  margin: 1rem;
  background-color: ${Colorscheme.c900};
  color: ${Colorscheme.c200};
  outline: none;
`;

export const StyledText = styled.h1`
  color: ${Colorscheme.c200};
`;

export const PlayerInfo = styled.div`
  color: ${Colorscheme.c200};
  align-self: end;
  margin: 1em;
`;

export const UITextPrimary = styled.span`
  display: block;
  font-size: 2.5rem;
  text-align: end;
`;

export const UITextSecondary = styled.span`
  display: block;
  font-size: 2rem;
  text-align: end;
`;
