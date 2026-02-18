"use client";
import { useGlobalState } from "@/context/globalProvider";
import { edit, trash } from "@/utils/Icons";
import React from "react";
import styled from "styled-components";
import formatDate from "@/utils/formatDate";
import EditContent from "../Modals/EditContent";

interface Props {
  id: string;
  date: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isImportant: boolean;
  isUrgent: boolean;
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
  const { theme, modal, openModal, deleteTask, updateTask, EditContent } =
    useGlobalState();
  return (
    <TaskItemStyled theme={theme}>
      <div className="title-task-date">
        <h1>{title}</h1>
        <p className="date">{formatDate(date)}</p>
      </div>

      <p>{description}</p>

      <div className="task-footer">
        <div className="component">
          {isCompleted ? (
            <button
              className="completed"
              onClick={() => {
                const task = {
                  id,
                  isCompleted: !isCompleted,
                };

                updateTask(task);
              }}
            >
              Completed
            </button>
          ) : (
            <button
              className="incomplete"
              onClick={() => {
                const task = {
                  id,
                  isCompleted: !isCompleted,
                };

                updateTask(task);
              }}
            >
              Incomplete
            </button>
          )}

          {isImportant ? (
            <button
              className="important"
              onClick={() => {
                const task = {
                  id,
                  isImportant: !isImportant,
                };

                updateTask(task);
              }}
            >
              Important
            </button>
          ) : (
            <button
              className="minor"
              onClick={() => {
                const task = {
                  id,
                  isImportant: !isImportant,
                };

                updateTask(task);
              }}
            >
              Minor
            </button>
          )}

          {isUrgent ? (
            <button
              className="highPriority"
              onClick={() => {
                const task = {
                  id,
                  isUrgent: !isUrgent,
                };

                updateTask(task);
              }}
            >
              High Priority
            </button>
          ) : (
            <button
              className="lowPriority"
              onClick={() => {
                const task = {
                  id,
                  isUrgent: !isUrgent,
                };

                updateTask(task);
              }}
            >
              Low Priority
            </button>
          )}
        </div>

        {/* <button
          className="edit"
          onClick={() => {
            EditContent(id);
          }}
        >
          {edit}
        </button> */}

        {/* <div className="btn-options"> */}
        {/* <button className="edit" onClick={openModal}>
            {edit}
          </button> */}

        <button
          className="delete"
          onClick={() => {
            deleteTask(id);
          }}
        >
          {trash}
        </button>
      </div>
      {/* </div> */}
    </TaskItemStyled>
  );
}

const TaskItemStyled = styled.div`
  padding: 1.2rem 1rem;
  border-radius: 0.5rem;
  background-color: ${(props) => props.theme.borderColor2};
  box-shadow: ${(props) => props.theme.shadow7};
  border: 2px solid ${(props) => props.theme.borderColor2};

  height: 14rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .title-task-date {
    display: flex;
    justify-content: space-between;
    height: fit-content;
  }

  h1 {
    font-size: 1.6rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .date {
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  p {
    height: 100%;
    font-size: 15px;
  }

  .task-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;

    width: 100%;

    .component {
      display: flex;
      gap: 0.8rem;
    }

    button {
      text-align: center;
      justify-content: center;
      align-items: center;
      display: flex;

      border: none;
      outline: none;
      cursor: pointer;

      i {
        font-size: 1.4rem;
        color: ${(props) => props.theme.colorGrey2};
      }
    }

    .edit {
      margin-left: auto;
    }

    .completed,
    .incomplete {
      display: inline-block;
      padding: 0.4rem 0.8rem;
      background: ${(props) => props.theme.colorDanger};
      border-radius: 30px;

      font-size: 12px;
      font-weight: 600;
    }

    .completed {
      background: ${(props) => props.theme.colorGreenDark} !important;
    }

    .important,
    .minor {
      display: inline-block;
      padding: 0.4rem 0.8rem;
      background: ${(props) => props.theme.colorDanger};
      border-radius: 30px;

      font-size: 12px;
      font-weight: 600;
    }

    .minor {
      background: ${(props) => props.theme.colorMinor} !important;
    }

    .highPriority,
    .lowPriority {
      display: inline-block;
      padding: 0.4rem 0.8rem;
      background: ${(props) => props.theme.colorLow};
      border-radius: 30px;

      font-size: 12px;
      font-weight: 600;
    }

    .highPriority {
      background: ${(props) => props.theme.colorHigh} !important;
    }

    .btn-options {
      display: flex;
      gap: 0.5rem;
    }
  }
`;

export default TaskItem;
