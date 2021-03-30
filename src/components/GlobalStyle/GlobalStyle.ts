import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    * {
        box-sizing: border-box;
    }
  }

  :root {
    --color-bg-home-win: #eee;
    --color-bg-draw: #000;
    --color-bg-away-win: #7d7d80;
    --color-accordion-header: #eee;
    --color-code-block: #eee;
  }
`;
