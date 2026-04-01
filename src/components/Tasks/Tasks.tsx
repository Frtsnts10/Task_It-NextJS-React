"use client";
import { useGlobalState } from "@/context/globalProvider";
import React from "react";
import styled from "styled-components";
import CreateContent from "../Modals/CreateContent";
import DeleteContent from "../Modals/DeleteContent";
import TaskItem from "../TaskItem/TaskItem";
import { plus } from "@/utils/Icons";
import Modal from "../Modals/Modals";

interface Props {
  title: string;
  tasks: any[];
}

function Tasks({ title, tasks }: Props) {
  const { theme, isLoading, openModal, modal, deleteModalId } = useGlobalState();

  return (
    <TaskStyled theme={theme}>
      {modal && <Modal content={<CreateContent />} />}
      {deleteModalId && <Modal content={<DeleteContent />} />}

      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">{title}</h1>
          <span className="task-count">{tasks.length} tasks</span>
        </div>

        <button className="btn-create" onClick={openModal}>
          <span className="btn-icon">{plus}</span>
          <span>New Task</span>
        </button>
      </div>

      {!isLoading ? (
        <div className="tasks-container">
          {tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No tasks here</h3>
              <p>Click "New Task" to get started</p>
            </div>
          ) : (
            <div className="tasks-grid">
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  id={task.id}
                  date={task.date}
                  title={task.title}
                  description={task.description}
                  isCompleted={task.is_completed}
                  isImportant={task.is_important}
                  isUrgent={task.is_urgent}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="tasks-loader">
          <span className="loader" />
        </div>
      )}
    </TaskStyled>
  );
}

const TaskStyled = styled.main`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: ${(props) => props.theme.colorBg2};
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 16px;
  overflow: hidden;

  /* Page Header */
  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.75rem 2rem 1.25rem;
    border-bottom: 1px solid ${(props) => props.theme.borderColor};
    flex-shrink: 0;
  }

  .header-left {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
  }

  .page-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${(props) => props.theme.colorGrey0};
    letter-spacing: -0.02em;
  }

  .task-count {
    font-size: 0.8rem;
    font-weight: 500;
    color: ${(props) => props.theme.colorGrey3};
    background: ${(props) => props.theme.colorBg4};
    border: 1px solid ${(props) => props.theme.borderColor};
    padding: 0.15rem 0.6rem;
    border-radius: 99px;
  }

  /* Create Button */
  .btn-create {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.55rem 1.1rem;
    background: ${(props) => props.theme.colorPrimary};
    color: #fff;
    border-radius: 10px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 1px solid transparent;

    .btn-icon {
      display: flex;
      align-items: center;
    }

    &:hover {
      background: ${(props) => props.theme.colorPrimaryHover};
      box-shadow: 0 0 16px ${(props) => props.theme.colorPrimaryGlow};
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  }

  /* Tasks Container */
  .tasks-container {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem 2rem;

    @media screen and (max-width: 768px) {
      padding: 1rem;
    }
  }

  /* Grid */
  .tasks-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1rem;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  /* Empty state */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 50vh;
    gap: 0.5rem;
    color: ${(props) => props.theme.colorGrey3};

    .empty-icon {
      font-size: 3rem;
      margin-bottom: 0.5rem;
      opacity: 0.5;
    }

    h3 {
      font-size: 1.1rem;
      font-weight: 600;
      color: ${(props) => props.theme.colorGrey2};
    }

    p {
      font-size: 0.875rem;
    }
  }

  /* Loader */
  .tasks-loader {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export default Tasks;
