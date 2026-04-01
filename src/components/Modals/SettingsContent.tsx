"use client";

import { useGlobalState } from "@/context/globalProvider";
import { cross, gear } from "@/utils/Icons";
import React, { useState } from "react";
import styled from "styled-components";
import { useUser, useClerk } from "@clerk/nextjs";
import Image from "next/image";

function SettingsContent() {
  const { theme, closeSettings, selectedTheme, toggleTheme } = useGlobalState();
  const isDark = selectedTheme === 0;
  const { user } = useUser();
  const { openUserProfile } = useClerk();
  const [activeTab, setActiveTab] = useState<"account" | "appearance">("account");

  const { firstName, lastName, imageUrl, emailAddresses } = user || {
    firstName: "",
    lastName: "",
    imageUrl: "",
    emailAddresses: [],
  };

  const primaryEmail = emailAddresses?.[0]?.emailAddress || "";
  const avatarSrc = imageUrl && imageUrl !== "" ? imageUrl : "https://res.cloudinary.com/dt9rvu6it/image/upload/v1711200000/avatar-placeholder_p9x8p5.png";

  return (
    <SettingsStyled theme={theme}>
      {/* Header */}
      <div className="modal-header">
        <div className="header-left">
          <div className="header-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </div>
          <h2>Settings</h2>
        </div>
        <button type="button" className="close-btn" onClick={closeSettings}>
          {cross}
        </button>
      </div>

      <div className="settings-body">
        {/* Sidebar Tabs */}
        <div className="settings-sidebar">
          <button
            className={`tab-btn ${activeTab === "account" ? "active" : ""}`}
            onClick={() => setActiveTab("account")}
          >
            <span className="tab-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            Account
          </button>
          <button
            className={`tab-btn ${activeTab === "appearance" ? "active" : ""}`}
            onClick={() => setActiveTab("appearance")}
          >
            <span className="tab-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            </span>
            Appearance
          </button>
        </div>

        {/* Content Area */}
        <div className="settings-content">
          {activeTab === "account" && (
            <div className="tab-panel animate-fade-in">
              <h3>Profile Info</h3>
              <div className="profile-card glass-card">
                <div className="avatar-lg">
                  <Image src={avatarSrc} alt="User avatar" width={64} height={64} />
                </div>
                <div className="profile-details">
                  <h4>{firstName} {lastName}</h4>
                  <p>{primaryEmail}</p>
                </div>
              </div>

              <div className="settings-section">
                <div className="section-header">
                  <h4>Account Management</h4>
                  <p>Manage your password, emails, and connected accounts directly via Clerk.</p>
                </div>
                <button className="btn-manage" onClick={() => openUserProfile()}>
                  Manage Account Details
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="tab-panel animate-fade-in">
              <h3>Theme Settings</h3>
              
              <div className="settings-section">
                <div className="section-header">
                  <h4>Theme Mode</h4>
                  <p>Choose your preferred appearance for Task-It.</p>
                </div>
                
                <div className="theme-toggle-card glass-card">
                  <div className="toggle-info">
                    <div className={`icon ${isDark ? "active" : "active-light"}`}>
                      {isDark ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="4" />
                          <path d="M12 2v2" />
                          <path d="M12 20v2" />
                          <path d="m4.93 4.93 1.41 1.41" />
                          <path d="m17.66 17.66 1.41 1.41" />
                          <path d="M2 12h2" />
                          <path d="M20 12h2" />
                          <path d="m6.34 17.66-1.41 1.41" />
                          <path d="m19.07 4.93-1.41 1.41" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <span className="toggle-title">{isDark ? "Dark Theme" : "Light Theme"}</span>
                      <span className="toggle-desc">{isDark ? "Default appearance" : "Bright appearance"}</span>
                    </div>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={!isDark} onChange={toggleTheme} />
                    <span className="toggle-slider" />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </SettingsStyled>
  );
}

const SettingsStyled = styled.div`
  display: flex;
  flex-direction: column;
  height: 550px;
  max-height: 85vh;

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
  .settings-body {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  /* Sidebar */
  .settings-sidebar {
    width: 160px;
    flex-shrink: 0;
    border-right: 1px solid ${(props) => props.theme.borderColor};
    padding: 1.25rem 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    background: ${(props) => props.theme.colorBg};
  }

  .tab-btn {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.6rem 0.75rem;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 500;
    color: ${(props) => props.theme.colorGrey2};
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;

    .tab-icon {
      color: ${(props) => props.theme.colorGrey3};
      display: flex;
      align-items: center;
    }

    &:hover {
      background: ${(props) => props.theme.colorBg4};
      color: ${(props) => props.theme.colorGrey1};
    }

    &.active {
      background: ${(props) => props.theme.activeNavLink};
      color: ${(props) => props.theme.colorGrey0};
      
      .tab-icon {
        color: ${(props) => props.theme.colorPrimary};
      }
    }
  }

  /* Content */
  .settings-content {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
    background: ${(props) => props.theme.colorBg2};
  }

  .tab-panel {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    
    h3 {
      font-size: 1.1rem;
      font-weight: 600;
      color: ${(props) => props.theme.colorGrey0};
      margin-bottom: 0.25rem;
    }
  }

  .profile-card {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    padding: 1.25rem;
    
    .avatar-lg {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid ${(props) => props.theme.colorPrimary};
      flex-shrink: 0;
      
      img {
        object-fit: cover;
      }
    }

    .profile-details {
      h4 {
        font-size: 1.05rem;
        font-weight: 600;
        color: ${(props) => props.theme.colorGrey0};
        margin-bottom: 0.15rem;
      }
      p {
        font-size: 0.85rem;
        color: ${(props) => props.theme.colorGrey3};
      }
    }
  }

  .settings-section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding-top: 1.5rem;
    border-top: 1px solid ${(props) => props.theme.borderColor};

    .section-header {
      h4 {
        font-size: 0.95rem;
        font-weight: 600;
        color: ${(props) => props.theme.colorGrey1};
        margin-bottom: 0.2rem;
      }
      p {
        font-size: 0.8rem;
        color: ${(props) => props.theme.colorGrey3};
      }
    }
  }

  .btn-manage {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1.2rem;
    background: ${(props) => props.theme.colorBg4};
    border: 1px solid ${(props) => props.theme.borderColor};
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 500;
    color: ${(props) => props.theme.colorGrey1};
    cursor: pointer;
    transition: all 0.2s ease;
    align-self: flex-start;
    margin-top: 0.5rem;

    svg {
      transition: transform 0.2s ease;
    }

    &:hover {
      background: ${(props) => props.theme.colorBg3};
      color: ${(props) => props.theme.colorGrey0};
      border-color: ${(props) => props.theme.colorGrey4};
      
      svg {
        transform: translateX(3px);
      }
    }
  }

  .theme-toggle-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem;
    margin-top: 0.5rem;
    
    .toggle-info {
      display: flex;
      align-items: center;
      gap: 1rem;

      .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 8px;
        background: ${(props) => props.theme.colorBg4};
        color: ${(props) => props.theme.colorGrey3};

        &.active {
          background: ${(props) => props.theme.colorPrimaryLight};
          color: ${(props) => props.theme.colorPrimary};
        }

        &.active-light {
          background: rgba(234, 179, 8, 0.15); /* Yellow for light mode sun */
          color: #d97706;
        }
      }

      .toggle-title {
        display: block;
        font-size: 0.9rem;
        font-weight: 500;
        color: ${(props) => props.theme.colorGrey0};
      }
      .toggle-desc {
        display: block;
        font-size: 0.75rem;
        color: ${(props) => props.theme.colorGrey3};
      }
    }
  }
`;

export default SettingsContent;
