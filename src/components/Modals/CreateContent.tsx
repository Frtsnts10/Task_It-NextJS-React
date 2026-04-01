"use client";

import { useGlobalState } from "@/context/globalProvider";
import React, { useState } from "react";
import toast from "react-hot-toast";
import styled from "styled-components";
import { cross } from "@/utils/Icons";
import DatePicker from "../DatePicker/DatePicker";

function CreateContent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [completed, setCompleted] = useState(false);
  const [important, setImportant] = useState(false);
  const [highPriority, setHighPriority] = useState(false);
  const [loading, setLoading] = useState(false);

  const { theme, allTasks, closeModal } = useGlobalState();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (title.trim().length < 3) {
      toast.error("Title must be at least 3 characters");
      return;
    }
    if (!date) {
      toast.error("Please select a date");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          date,
          completed,
          important,
          highPriority,
        }),
      });

      const contentType = res.headers.get("content-type");
      let data;
      
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      }

      if (!res.ok) {
        const errorMsg = data?.error || `Error ${res.status}: ${res.statusText}`;
        toast.error(errorMsg);
        return;
      }

      toast.success("Task created!");
      allTasks();
      closeModal();
    } catch (err: any) {
      console.error("Task creation failed:", err);
      toast.error(err.message || "Something went wrong! Check connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CreateStyled onSubmit={handleSubmit} theme={theme}>
      {/* Header */}
      <div className="modal-header">
        <div className="header-left">
          <div className="header-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          <h2>New Task</h2>
        </div>
        <button type="button" className="close-btn" onClick={closeModal}>
          {cross}
        </button>
      </div>

      {/* Body */}
      <div className="modal-body">
        {/* Title */}
        <div className="field">
          <label htmlFor="title">Title <span className="required">*</span></label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            autoFocus
            maxLength={80}
          />
        </div>

        {/* Description */}
        <div className="field">
          <label htmlFor="description">Description <span className="optional">(optional)</span></label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more details..."
            rows={3}
          />
        </div>

        {/* Date */}
        <div className="field">
          <label>Due Date <span className="required">*</span></label>
          <DatePicker
            value={date}
            onChange={setDate}
            placeholder="Pick a due date"
          />
        </div>

        {/* Toggles */}
        <div className="toggles-grid">
          <div className="toggle-item">
            <div className="toggle-info">
              <span className="toggle-icon">✓</span>
              <div>
                <p className="toggle-name">Completed</p>
                <p className="toggle-desc">Mark as done</p>
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
              />
              <span className="toggle-slider" />
            </label>
          </div>

          <div className="toggle-item">
            <div className="toggle-info">
              <span className="toggle-icon important">★</span>
              <div>
                <p className="toggle-name">Important</p>
                <p className="toggle-desc">High importance</p>
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={important}
                onChange={(e) => setImportant(e.target.checked)}
              />
              <span className="toggle-slider" />
            </label>
          </div>

          <div className="toggle-item">
            <div className="toggle-info">
              <span className="toggle-icon urgent">⚡</span>
              <div>
                <p className="toggle-name">Urgent</p>
                <p className="toggle-desc">High priority</p>
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={highPriority}
                onChange={(e) => setHighPriority(e.target.checked)}
              />
              <span className="toggle-slider" />
            </label>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="modal-footer">
        <button type="button" className="btn-cancel" onClick={closeModal}>
          Cancel
        </button>
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? (
            <span className="btn-loader" />
          ) : (
            "Create Task"
          )}
        </button>
      </div>
    </CreateStyled>
  );
}

const CreateStyled = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0;
  height: 100%;

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
    background: ${(props) => props.theme.colorPrimaryLight};
    border: 1px solid ${(props) => props.theme.borderColorAccent};
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${(props) => props.theme.colorPrimary};
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
    flex: 1;
    overflow-y: auto;
    padding: 1.25rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.1rem;
  }

  /* Fields */
  .field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;

    label {
      font-size: 0.8rem;
      font-weight: 600;
      color: ${(props) => props.theme.colorGrey2};
      letter-spacing: 0.03em;
    }

    .required {
      color: ${(props) => props.theme.colorDanger};
      margin-left: 2px;
    }

    .optional {
      color: ${(props) => props.theme.colorGrey3};
      font-weight: 400;
    }

    input,
    textarea,
    select {
      padding: 0.7rem 0.9rem;
      background: ${(props) => props.theme.colorBg};
      border: 1px solid ${(props) => props.theme.borderColor};
      border-radius: 9px;
      color: ${(props) => props.theme.colorGrey0};
      font-size: 0.9rem;
      resize: none;
      transition: all 0.2s ease;

      &::placeholder {
        color: ${(props) => props.theme.colorGrey4};
      }

      &:focus {
        border-color: ${(props) => props.theme.colorPrimary};
        box-shadow: 0 0 0 3px ${(props) => props.theme.colorPrimaryLight};
        outline: none;
      }
    }

    input[type="date"] {
      color-scheme: dark;
    }
  }

  /* Toggles */
  .toggles-grid {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    border: 1px solid ${(props) => props.theme.borderColor};
    border-radius: 10px;
    overflow: hidden;
  }

  .toggle-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.8rem 1rem;
    background: ${(props) => props.theme.colorBg};
    border-bottom: 1px solid ${(props) => props.theme.borderColor};
    transition: background 0.2s ease;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background: ${(props) => props.theme.colorBg4};
    }
  }

  .toggle-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .toggle-icon {
    font-size: 1rem;
    width: 24px;
    text-align: center;
    color: ${(props) => props.theme.colorGrey3};

    &.important {
      color: ${(props) => props.theme.colorWarning};
    }

    &.urgent {
      color: ${(props) => props.theme.colorDanger};
    }
  }

  .toggle-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: ${(props) => props.theme.colorGrey1};
  }

  .toggle-desc {
    font-size: 0.75rem;
    color: ${(props) => props.theme.colorGrey3};
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
    background: ${(props) => props.theme.colorPrimary};
    color: #fff;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 110px;

    &:hover:not(:disabled) {
      background: ${(props) => props.theme.colorPrimaryHover};
      box-shadow: 0 0 16px ${(props) => props.theme.colorPrimaryGlow};
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

export default CreateContent;
