"use client";
import { useGlobalState } from "@/context/globalProvider";
import React from "react";
import styled from "styled-components";

interface Props {
  content: React.ReactNode;
}

function Modal({ content }: Props) {
  const { closeModal, closeSettings, theme } = useGlobalState();

  const handleClose = () => {
    closeModal();
    closeSettings();
  };

  return (
    <ModalStyled theme={theme}>
      <div className="modal-overlay" onClick={handleClose} />
      <div className="modal-content animate-scale-in">{content}</div>
    </ModalStyled>
  );
}

const ModalStyled = styled.div`
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;

  .modal-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.65);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    animation: fadeIn 0.2s ease;

    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
  }

  .modal-content {
    position: relative;
    width: 100%;
    max-width: 520px;
    max-height: 90vh;
    z-index: 201;
    background: ${(props) => props.theme.colorBg2};
    border: 1px solid ${(props) => props.theme.borderColor};
    border-radius: 16px;
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6),
                0 0 0 1px ${(props) => props.theme.borderColorAccent};
    overflow: hidden;
    display: flex;
    flex-direction: column;

    animation: scaleIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);

    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.93) translateY(12px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    @media screen and (max-width: 480px) {
      max-height: 95vh;
    }
  }
`;

export default Modal;
