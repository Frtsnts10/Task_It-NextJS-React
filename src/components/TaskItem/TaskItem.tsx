"use client";
import { useGlobalState } from "@/context/globalProvider";
import { trash } from "@/utils/Icons";
import React from "react";
import styled from "styled-components";
import { format, parseISO, isValid } from "date-fns";

interface Props {
  id: string;
  date: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isImportant: boolean;
  isUrgent: boolean;
}

function formatTaskDate(dateStr: string) {
  try {
    const d = parseISO(dateStr);
    if (isValid(d)) return format(d, "MMM d, yyyy");
    return dateStr;
  } catch {
    return dateStr;
  }
}

function TaskItem({
  id,
  title,
  description,
  date,
  isCompleted,
  isImportant,
  isUrgent,
}: Props) {
  const { theme, deleteTask, updateTask, openDeleteModal } = useGlobalState();

  return (
    <TaskItemStyled theme={theme} $completed={isCompleted}>
      {/* Header */}
      <div className="card-header">
        <div className="title-group">
          <button
            className="complete-toggle"
            onClick={() => updateTask({ id, isCompleted: !isCompleted })}
            title={isCompleted ? "Mark incomplete" : "Mark complete"}
          >
            <span className={`check-box ${isCompleted ? "checked" : ""}`}>
              {isCompleted && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </span>
          </button>
          <h3 className={`task-title ${isCompleted ? "completed" : ""}`}>
            {title}
          </h3>
        </div>
        <time className="task-date">{formatTaskDate(date)}</time>
      </div>

      {/* Description */}
      {description && (
        <p className="task-description">{description}</p>
      )}

      {/* Footer */}
      <div className="card-footer">
        <div className="badges">
          {/* Priority badge */}
          <span className={`badge ${isUrgent ? "badge-urgent" : "badge-low"}`}>
            {isUrgent ? "⚡ Urgent" : "Low Priority"}
          </span>

          {/* Importance badge */}
          <span
            className={`badge ${isImportant ? "badge-important" : "badge-minor"}`}
          >
            {isImportant ? "★ Important" : "Minor"}
          </span>

          {/* Status badge */}
          <span
            className={`badge ${isCompleted ? "badge-done" : "badge-pending"}`}
          >
            {isCompleted ? "✓ Done" : "Pending"}
          </span>
        </div>

        <div className="actions">
          {/* Toggle buttons */}
          <button
            className="icon-btn"
            onClick={() => updateTask({ id, isUrgent: !isUrgent })}
            title={isUrgent ? "Remove urgent" : "Mark urgent"}
          >
            ⚡
          </button>
          <button
            className="icon-btn"
            onClick={() => updateTask({ id, isImportant: !isImportant })}
            title={isImportant ? "Remove importance" : "Mark important"}
          >
            ★
          </button>
          <button
            className="icon-btn delete-btn"
            onClick={() => openDeleteModal(id)}
            title="Delete task"
          >
            {trash}
          </button>
        </div>
      </div>
    </TaskItemStyled>
  );
}

const TaskItemStyled = styled.div<{ $completed: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.25rem;
  border-radius: 12px;
  background: ${(props) => props.theme.colorBg3};
  border: 1px solid ${(props) => props.theme.borderColor};
  transition: all 0.2s ease;
  animation: fadeIn 0.3s ease forwards;
  opacity: ${(props) => (props.$completed ? 0.7 : 1)};

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: ${(props) => (props.$completed ? 0.7 : 1)}; transform: translateY(0); }
  }

  &:hover {
    border-color: ${(props) => props.theme.borderColorAccent};
    box-shadow: ${(props) => props.theme.shadowGlow};
    transform: translateY(-2px);
    opacity: 1;
  }

  /* Header */
  .card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.75rem;
  }

  .title-group {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    flex: 1;
    min-width: 0;
  }

  /* Custom checkbox */
  .complete-toggle {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .check-box {
    width: 18px;
    height: 18px;
    border-radius: 5px;
    border: 2px solid ${(props) => props.theme.borderColorAccent};
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    flex-shrink: 0;
    color: #fff;

    &.checked {
      background: ${(props) => props.theme.colorPrimary};
      border-color: ${(props) => props.theme.colorPrimary};
    }

    &:not(.checked):hover {
      border-color: ${(props) => props.theme.colorPrimary};
      background: ${(props) => props.theme.colorPrimaryLight};
    }
  }

  .task-title {
    font-size: 0.95rem;
    font-weight: 600;
    color: ${(props) => props.theme.colorGrey0};
    line-height: 1.4;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: all 0.2s ease;

    &.completed {
      text-decoration: line-through;
      color: ${(props) => props.theme.colorGrey3};
    }
  }

  .task-date {
    font-size: 0.75rem;
    color: ${(props) => props.theme.colorGrey3};
    white-space: nowrap;
    flex-shrink: 0;
  }

  /* Description */
  .task-description {
    font-size: 0.85rem;
    color: ${(props) => props.theme.colorGrey2};
    line-height: 1.55;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Footer */
  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-top: auto;
  }

  .badges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    padding: 0.2rem 0.55rem;
    border-radius: 99px;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    white-space: nowrap;

    &.badge-urgent {
      background: ${(props) => props.theme.colorHigh};
      color: ${(props) => props.theme.colorHighText};
    }
    &.badge-low {
      background: ${(props) => props.theme.colorLow};
      color: ${(props) => props.theme.colorLowText};
    }
    &.badge-important {
      background: ${(props) => props.theme.colorImportant};
      color: ${(props) => props.theme.colorImportantText};
    }
    &.badge-minor {
      background: ${(props) => props.theme.colorMinor};
      color: ${(props) => props.theme.colorMinorText};
    }
    &.badge-done {
      background: ${(props) => props.theme.colorGreenLight};
      color: ${(props) => props.theme.colorGreenDark};
    }
    &.badge-pending {
      background: ${(props) => props.theme.colorBg4};
      color: ${(props) => props.theme.colorGrey3};
    }
  }

  /* Action buttons */
  .actions {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    flex-shrink: 0;
  }

  .icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 7px;
    cursor: pointer;
    font-size: 0.8rem;
    color: ${(props) => props.theme.colorGrey3};
    transition: all 0.2s ease;

    svg {
      width: 14px;
      height: 14px;
    }

    &:hover {
      background: ${(props) => props.theme.colorBg4};
      color: ${(props) => props.theme.colorGrey1};
    }

    &.delete-btn:hover {
      background: ${(props) => props.theme.colorDangerLight};
      color: ${(props) => props.theme.colorDanger};
    }
  }
`;

export default TaskItem;
