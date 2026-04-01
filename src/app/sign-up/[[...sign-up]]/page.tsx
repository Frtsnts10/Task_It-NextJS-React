"use client";

import { SignUp } from "@clerk/nextjs";
import React from "react";

export default function SignUpPage() {
  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-content">
        <div className="auth-brand">
          <div className="auth-logo">✓</div>
          <h1>Task-It</h1>
          <p>Create your account to get started</p>
        </div>
        <SignUp
          appearance={{
            variables: {
              colorPrimary: "#6366f1",
              colorBackground: "#161b22",
              colorInputBackground: "#0d1117",
              colorInputText: "#e6edf3",
              colorText: "#e6edf3",
              colorTextSecondary: "#8b949e",
              borderRadius: "10px",
            },
            elements: {
              card: {
                boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
                border: "1px solid rgba(48,54,61,0.8)",
              },
              formButtonPrimary: {
                backgroundColor: "#6366f1",
                "&:hover": { backgroundColor: "#818cf8" },
              },
            },
          }}
        />
      </div>
      <style>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }
        .auth-bg {
          position: fixed;
          inset: 0;
          background: radial-gradient(ellipse at 80% 50%, rgba(99,102,241,0.08) 0%, transparent 60%),
                      radial-gradient(ellipse at 20% 20%, rgba(129,140,248,0.06) 0%, transparent 50%);
          pointer-events: none;
        }
        .auth-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          position: relative;
          z-index: 1;
        }
        .auth-brand {
          text-align: center;
        }
        .auth-logo {
          width: 52px;
          height: 52px;
          background: #6366f1;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: #fff;
          margin: 0 auto 0.75rem;
          box-shadow: 0 0 24px rgba(99,102,241,0.4);
        }
        .auth-brand h1 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #e6edf3;
        }
        .auth-brand p {
          font-size: 0.875rem;
          color: #8b949e;
          margin-top: 0.25rem;
        }
      `}</style>
    </div>
  );
}
