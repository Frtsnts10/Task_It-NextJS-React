import { useGlobalState } from "@/context/globalProvider";
import { cross } from "@/utils/Icons";
import React from "react";
import styled from "styled-components";

function EditContent() {
  const { theme, closeSettings } = useGlobalState();

  const handleClose = async (e: any) => {
    e.preventDefault();

    closeSettings();
  };
  return (
    <EditContentStyled theme={theme}>
      <div className="title-bar">
        <h1>Edit Content</h1>
        <button className="btn-rounded" onClick={closeSettings}>
          {cross}
        </button>
      </div>

      <div className="container">
        <div className="dark-light-switch">
          <p>Dark Mode</p>
          <label className="switch">
            <input type="checkbox" />
            <span className="slider round"></span>
          </label>

          
        </div>
      </div>
    </EditContentStyled>
  );
}

const EditContentStyled = styled.div`
  h1 {
    font-size: clamp(1.2rem, 5vw, 1.6rem);
    font-weight: 600;
  }

  color: ${(props) => props.theme.colorGrey1};
  .title-bar {
    display: flex;
    justify-content: space-between;

    .button {
      cursor: pointer;
    }
  }
`;

export default EditContent;
