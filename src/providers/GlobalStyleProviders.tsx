"use client";
import React from "react";
import styled from "styled-components";

import { useGlobalState } from "@/context/globalProvider";

interface Props {
  children: React.ReactNode;
}

function GlobalStyleProvider({ children }: Props) {
  const { theme } = useGlobalState();
  return <GlobalStyles theme={theme}>{children}</GlobalStyles>;
}

const GlobalStyles = styled.div`
  display: flex;
  background-color: ${(props) => props.theme.colorBg};
  color: ${(props) => props.theme.colorGrey0};
  gap: 1.25rem;
  padding: 1.25rem;
  height: 100vh;
  overflow: hidden;
  transition: all 0.3s ease;

  .main-content {
    flex: 1;
    overflow: hidden;
    min-width: 0;
  }

  @media screen and (max-width: 768px) {
    padding: 1rem;
    gap: 0;

    .main-content {
      flex: 1;
    }
  }
`;

export default GlobalStyleProvider;
