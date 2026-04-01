"use client";
import { useGlobalState } from "@/context/globalProvider";
import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

interface Props {
  icon?: React.ReactNode;
  name?: string;
  background?: string;
  padding?: string;
  borderRad?: string;
  fw?: string;
  fs?: string;
  click?: () => void;
  type?: "submit" | "button" | "reset" | undefined;
  border?: string;
  color?: string;
}

function Button({
  icon,
  name,
  background,
  padding,
  borderRad,
  fw,
  fs,
  click,
  type,
  border,
  color,
}: Props) {
  const { theme } = useGlobalState();

  return (
    <ButtonStyled
      as={motion.button}
      type={type}
      style={{
        background: background,
        padding: padding || "0.5rem 1rem",
        borderRadius: borderRad || "0.5rem",
        fontWeight: fw || "500",
        fontSize: fs,
        border: border || "none",
        color: color || theme.colorGrey0,
      }}
      theme={theme}
      onClick={click}
      whileTap={{ scale: 0.93 }}
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      {icon && icon}
      {name}
    </ButtonStyled>
  );
}

const ButtonStyled = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  outline: none !important;
  box-shadow: none;
  color: ${(props) => props.theme.colorGrey2};
  transition: color 0.2s ease;

  i {
    margin: auto;
    color: ${(props) => props.theme.colorGrey2};
    font-size: 1.4rem;
    transition: color 0.2s ease;
  }

  &:hover {
    color: ${(props) => props.theme.colorGrey0};
    i {
      color: ${(props) => props.theme.colorGrey0};
    }
  }

  &:focus,
  &:focus-visible {
    outline: none !important;
    box-shadow: none !important;
  }
`;

export default Button;
