"use client";
import React from "react";
import styled from "styled-components";
import { useGlobalState } from "@/context/globalProvider";
import Image from "next/image";
import menu from "@/utils/menu";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { arrowLeft, bars, logout, gear } from "@/utils/Icons";
import { UserButton, useClerk, useUser } from "@clerk/nextjs";
import SettingsContent from "../Modals/SettingsContent";
import Modal from "../Modals/Modals";

function Sidebar() {
  const { theme, collapsed, collapseMenu } = useGlobalState();
  const { signOut } = useClerk();
  const { user } = useUser();
  const { firstName, lastName, imageUrl } = user || {
    firstName: "",
    lastName: "",
    imageUrl: "",
  };

  const router = useRouter();
  const pathname = usePathname();
  const { settings, openSettings } = useGlobalState();

  // Fallback avatar if no imageUrl is provided
  const avatarSrc = imageUrl && imageUrl !== "" ? imageUrl : "https://res.cloudinary.com/dt9rvu6it/image/upload/v1711200000/avatar-placeholder_p9x8p5.png";

  const handleClick = (link: string) => {
    router.push(link);
  };

  return (
    <SidebarStyled theme={theme} collapsed={collapsed.toString()}>
      {settings && <Modal content={<SettingsContent />} />}

      <button className="toggle-nav" onClick={collapseMenu}>
        {collapsed ? bars : arrowLeft}
      </button>

      <div className="sidebar-inner">
        {/* Profile */}
        <div className="profile">
          <div className="profile-overlay" />
          <div className="avatar-wrapper">
            <Image 
              width={44} 
              height={44} 
              src={avatarSrc} 
              alt="profile" 
              priority
            />
            <div className="user-btn-overlay">
              <UserButton />
            </div>
          </div>
          <div className="profile-info">
            <span className="greeting">Hello,</span>
            <h2 className="name capitalize">
              {firstName} {lastName}
            </h2>
          </div>
        </div>

        {/* Label */}
        <div className="nav-label">Navigation</div>

        {/* Nav Items */}
        <ul className="nav-items">
          {menu.map((item) => {
            const link = item.link;
            const isActive = pathname === link;
            return (
              <li
                key={item.id}
                className={`nav-item ${isActive ? "active" : ""}`}
                onClick={() => handleClick(link)}
              >
                <span className="nav-icon">{item.icon}</span>
                <Link href={link} className="nav-label-text">
                  {item.title}
                </Link>
                {isActive && <span className="active-dot" />}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <button className="footer-btn" onClick={openSettings}>
          <span className="nav-icon">{gear}</span>
          <span>Settings</span>
        </button>
        <button
          className="footer-btn sign-out"
          onClick={() => signOut(() => router.push("/"))}
        >
          <span className="nav-icon">{logout}</span>
          <span>Sign Out</span>
        </button>
      </div>
    </SidebarStyled>
  );
}

const SidebarStyled = styled.nav<{ collapsed: string }>`
  position: relative;
  width: ${(props) => props.theme.sidebarWidth};
  min-width: ${(props) => props.theme.sidebarWidth};
  background: ${(props) => props.theme.colorBg2};
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media screen and (max-width: 768px) {
    position: fixed;
    top: 1rem;
    left: 1rem;
    height: calc(100vh - 2rem);
    z-index: 100;
    transform: ${(props) =>
      props.collapsed === "true" ? "translateX(-120%)" : "translateX(0)"};

    .toggle-nav {
      display: flex !important;
    }
  }

  .toggle-nav {
    display: none;
    position: absolute;
    right: -52px;
    top: 1.5rem;
    z-index: 200;
    padding: 0.6rem 0.9rem;
    background: ${(props) => props.theme.colorBg2};
    border: 1px solid ${(props) => props.theme.borderColor};
    border-left: none;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    cursor: pointer;
    color: ${(props) => props.theme.colorGrey0};
    align-items: center;
    justify-content: center;
    transition: background 0.2s ease;

    &:hover {
      background: ${(props) => props.theme.colorBg3};
    }
  }

  .sidebar-inner {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 1.5rem 0.75rem;

    &::-webkit-scrollbar {
      width: 0;
    }
  }

  /* Profile */
  .profile {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.9rem 0.75rem;
    margin-bottom: 1.5rem;
    border-radius: 12px;
    background: ${(props) => props.theme.colorPrimaryLight};
    border: 1px solid ${(props) => props.theme.borderColorAccent};
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(99, 102, 241, 0.18);
    }
  }

  .avatar-wrapper {
    position: relative;
    width: 44px;
    height: 44px;
    flex-shrink: 0;

    img {
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid ${(props) => props.theme.colorPrimary};
    }

    .user-btn-overlay {
      position: absolute;
      inset: 0;
      opacity: 0;
      z-index: 10;

      .cl-rootBox,
      .cl-userButtonBox,
      .cl-userButtonTrigger {
        width: 100%;
        height: 100%;
      }
    }
  }

  .profile-info {
    overflow: hidden;
    .greeting {
      display: block;
      font-size: 11px;
      color: ${(props) => props.theme.colorGrey2};
      letter-spacing: 0.05em;
    }
    .name {
      font-size: 0.95rem;
      font-weight: 600;
      color: ${(props) => props.theme.colorGrey0};
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  /* Nav label */
  .nav-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: ${(props) => props.theme.colorGrey3};
    padding: 0 0.75rem;
    margin-bottom: 0.5rem;
  }

  /* Nav items */
  .nav-items {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .nav-item {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.65rem 0.75rem;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: ${(props) => props.theme.colorGrey2};

    .nav-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      flex-shrink: 0;
      color: ${(props) => props.theme.colorGrey3};
      transition: color 0.2s ease;
    }

    .nav-label-text {
      font-size: 0.9rem;
      font-weight: 500;
      transition: color 0.2s ease;
    }

    .active-dot {
      position: absolute;
      right: 0.75rem;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: ${(props) => props.theme.colorPrimary};
      box-shadow: 0 0 8px ${(props) => props.theme.colorPrimary};
    }

    &:hover {
      background: ${(props) => props.theme.activeNavLinkHover};
      color: ${(props) => props.theme.colorGrey1};

      .nav-icon {
        color: ${(props) => props.theme.colorGrey2};
      }
    }

    &.active {
      background: ${(props) => props.theme.activeNavLink};
      color: ${(props) => props.theme.colorGrey0};
      border: 1px solid ${(props) => props.theme.borderColorAccent};

      .nav-icon {
        color: ${(props) => props.theme.colorPrimary};
      }

      .nav-label-text {
        color: ${(props) => props.theme.colorGrey0};
        font-weight: 600;
      }
    }
  }

  /* Footer */
  .sidebar-footer {
    padding: 0.75rem;
    border-top: 1px solid ${(props) => props.theme.borderColor};
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .footer-btn {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.65rem 0.75rem;
    border-radius: 10px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    color: ${(props) => props.theme.colorGrey2};
    transition: all 0.2s ease;

    .nav-icon {
      display: flex;
      align-items: center;
      width: 20px;
      flex-shrink: 0;
      color: ${(props) => props.theme.colorGrey3};
    }

    &:hover {
      background: ${(props) => props.theme.activeNavLinkHover};
      color: ${(props) => props.theme.colorGrey1};
    }

    &.sign-out:hover {
      background: ${(props) => props.theme.colorDangerLight};
      color: ${(props) => props.theme.colorDanger};

      .nav-icon {
        color: ${(props) => props.theme.colorDanger};
      }
    }
  }
`;

export default Sidebar;
