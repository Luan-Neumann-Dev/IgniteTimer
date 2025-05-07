import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        height: 0;
        box-sizing: border-box;
    }

    body {
        background: #333;
        color: #fff;
    }
`;