"use client";

import { useGlobalState } from "@/context/globalProvider";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Button from "../Button/Button";
import styled from "styled-components";
import { plus } from "@/utils/Icons";

function CreateContent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [completed, setCompleted] = useState(false);
  const [important, setImportant] = useState(false);
  const [highPriority, sethighPriority] = useState(false);

  const { theme, allTasks, closeModal } = useGlobalState();

  const handleChange = (name: string) => (e: any) => {
    // console.log(name, e.target.value);
    switch (name) {
      case "title":
        setTitle(e.target.value);
        break;
      case "description":
        setDescription(e.target.value);
        break;
      case "date":
        setDate(e.target.value);
        break;
      case "completed":
        setCompleted(e.target.checked);
        break;
      case "important":
        setImportant(e.target.checked);
        break;
      case "highPriority":
        sethighPriority(e.target.checked);
      default:
        break;
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const task = {
      title,
      description,
      date,
      completed,
      important,
      highPriority,
    };

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });

      if (res.ok) {
        toast.success("Task created successfully!");
        allTasks();
        closeModal();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong!");
      console.log(error);
    }
    // console.log(title, description, date, completed, important);
  };

  return (
    <CreateContentStyled onSubmit={handleSubmit} theme={theme}>
      <h1>Create a Task</h1>

      <div className="input-control">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          name="title"
          onChange={handleChange("title")}
          placeholder="Enter a title"
        />
      </div>

      <div className="input-control">
        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          id="description"
          rows={4}
          value={description}
          onChange={handleChange("description")}
          placeholder="Enter a description"
        ></textarea>
      </div>

      <div className="input-control">
        <label htmlFor="date">Date</label>
        <input
          value={date}
          onChange={handleChange("date")}
          type="date"
          name="date"
          id="date"
        />
      </div>

      <div className="options">
        <div className="input-control toggler">
          <label htmlFor="completed">Completed</label>
          <input
            value={completed.toString()}
            onChange={handleChange("completed")}
            type="checkbox"
            name="completed"
            id="completed"
            checked={completed}
          />
        </div>

        <div className="input-control toggler">
          <label htmlFor="important">Important</label>
          <input
            value={important.toString()}
            onChange={handleChange("important")}
            type="checkbox"
            name="important"
            id="important"
            checked={important}
          />
        </div>

        <div className="input-control toggler">
          <label htmlFor="important">High Priority</label>
          <input
            value={highPriority.toString()}
            onChange={handleChange("highPriority")}
            type="checkbox"
            name="highPriority"
            id="highPriority"
            checked={highPriority}
          />
        </div>
      </div>

      <div className="submit-btn flex justify-end">
        <Button
          type="submit"
          name="Create Task"
          // icon={plus}
          padding={"0.8rem 2rem"}
          borderRad={"0.8rem"}
          fw={"500"}
          fs={"1.2rem"}
          background={"rgb(0, 163, 255)"}
        />
      </div>
    </CreateContentStyled>
  );
}

const CreateContentStyled = styled.form`
  > h1 {
    font-size: clamp(1.2rem, 5vw, 1.6rem);
    font-weight: 600;
  }

  color: ${(props) => props.theme.colorGrey1};

  .input-control {
    position: relative;
    margin: 1.6rem 0;
    font-weight: 500;

    @media screen and (max-width: 450px) {
      margin: 1rem 0;
    }

    label {
      margin-bottom: 0.5rem;
      display: inline-block;
      font-size: clamp(0.9rem, 5vw, 1.2rem);

      span {
        color: ${(props) => props.theme.colorGrey3};
      }
    }

    input,
    textarea {
      width: 100%;
      padding: 1rem;

      resize: none;
      background-color: ${(props) => props.theme.colorGreyDark};
      color: ${(props) => props.theme.colorGrey2};
      border-radius: 0.5rem;
    }
  }

  .submit-btn button {
    transition: all 0.35s ease-in-out;

    @media screen and (max-width: 500px) {
      font-size: 0.9rem !important;
      padding: 0.6rem 1rem !important;

      i {
        font-size: 1.2rem !important;
        margin-right: 0.5rem !important;
      }
    }

    i {
      color: ${(props) => props.theme.colorGrey0};
    }

    &:hover {
      background: ${(props) => props.theme.colorPrimaryGreen} !important;
      color: ${(props) => props.theme.colorWhite} !important;
    }
  }

  .options {
    display: grid;
    gap: 1.5rem;
    margin: 1rem 0 1rem 0;
    grid-template-columns: repeat(3, 1fr);

    @media screen and (max-width: 876px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media screen and (max-width: 500px) {
      grid-template-columns: repeat(1, 1fr);
    }
  }

  .toggler {
    display: flex;
    align-items: center;
    justify-content: space-between;

    cursor: pointer;

    label {
      margin: auto;
      flex: 1;
    }

    input {
      width: initial;
    }
  }
`;

export default CreateContent;
