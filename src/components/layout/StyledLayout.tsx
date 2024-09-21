"use client";
import GlobalStyle from "@/styles/GlobalStyle";
import theme from "@/styles/theme";
import { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import Loader from "../Loader/Loader";
import Nav from "../Nav/Nav";
import Social from "../social/Social";
import Email from "../email/Email";

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const StyledLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const isHome =
    typeof window !== "undefined" ? window.location.pathname === "/" : true;

  const [isLoading, setIsLoading] = useState(isHome);

  return (
    <div id="root">
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <a className="skip-to-content" href="#content">
          Skip to Content
        </a>

        {isLoading && isHome ? (
          <Loader finishLoading={() => setIsLoading(false)} />
        ) : (
          <StyledContent>
            <Nav isHome={isHome} />
            <Social isHome={isHome} />
            <Email isHome={isHome} />
            <div id="content">{children}</div>
          </StyledContent>
        )}
      </ThemeProvider>
    </div>
  );
};

export default StyledLayout;
