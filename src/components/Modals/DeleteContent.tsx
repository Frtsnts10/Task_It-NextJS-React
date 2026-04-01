"use client";

import { useGlobalState } from "@/context/globalProvider";
import React, { useState } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";
import { cross, trash } from "@/utils/Icons";

function DeleteContent() {
  const [loading, setLoading] = useState(false);
  const { theme, deleteModalId, closeDeleteModal, deleteTask } = useGlobalState();

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deleteModalId) return;

    setLoading(true);
    try {
      await deleteTask(deleteModalId);
      closeDeleteModal();
    } catch {
      toast.error("Failed to delete task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DeleteStyled onSubmit={handleDelete} theme={theme}>
      {/* Header */}
      <div className="modal-header">
        <div className="header-left">
          <div className="header-icon danger">
            {trash}
          </div>
          <h2>Delete Task</h2>
        </div>
        <button type="button" className="close-btn" onClick={closeDeleteModal}>
          {cross}
        </button>
      </div>

      {/* Body */}
      <div className="modal-body">
        <p className="warning-text">
          Are you sure you want to delete this task? This action cannot be undone.
        </p>
      </div>

      {/* Footer */}
      <div className="modal-footer">
        <button type="button" className="btn-cancel" onClick={closeDeleteModal}>
          Cancel
        </button>
        <button type="submit" className="btn-submit delete" disabled={loading}>
          {loading ? (
            <span className="btn-loader" />
          ) : (
            "Delete Task"
          )}
        </button>
      </div>
    </DeleteStyled>
  );
}

const DeleteStyled = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0;

  /* Header */
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid ${(props) => props.theme.borderColor};
    flex-shrink: 0;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .header-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;

    &.danger {
      background: ${(props) => props.theme.colorDangerLight};
      border: 1px solid rgba(248, 81, 73, 0.35);
      color: ${(props) => props.theme.colorDanger};
    }
  }

  h2 {
    font-size: 1.05rem;
    font-weight: 700;
    color: ${(props) => props.theme.colorGrey0};
  }

  .close-btn {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: ${(props) => props.theme.colorGrey3};
    transition: all 0.2s ease;

    &:hover {
      background: ${(props) => props.theme.colorBg4};
      color: ${(props) => props.theme.colorGrey1};
    }
  }

  /* Body */
  .modal-body {
    padding: 1.5rem;
    text-align: left;
  }

  .warning-text {
    font-size: 0.95rem;
    color: ${(props) => props.theme.colorGrey1};
    line-height: 1.5;
  }

  /* Footer */
  .modal-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    border-top: 1px solid ${(props) => props.theme.borderColor};
    flex-shrink: 0;
  }

  .btn-cancel {
    padding: 0.6rem 1.2rem;
    border-radius: 9px;
    font-size: 0.875rem;
    font-weight: 500;
    color: ${(props) => props.theme.colorGrey2};
    background: ${(props) => props.theme.colorBg4};
    border: 1px solid ${(props) => props.theme.borderColor};
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: ${(props) => props.theme.colorBg3};
      color: ${(props) => props.theme.colorGrey0};
    }
  }

  .btn-submit {
    padding: 0.6rem 1.4rem;
    border-radius: 9px;
    font-size: 0.875rem;
    font-weight: 600;
    color: #fff;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 110px;

    &.delete {
      background: ${(props) => props.theme.colorDanger};
      
      &:hover:not(:disabled) {
        background: #f85149;
        box-shadow: 0 0 16px rgba(248, 81, 73, 0.4);
      }
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .btn-loader {
    display: inline-block;
    width: 16px;
    height: 16px;
    background: transparent !important;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    box-shadow: none !important;
    animation: spin 0.61s linear infinite;

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  }
`;

export default DeleteContent;
