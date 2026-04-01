"use client";
import React, { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { format, parseISO, isValid } from "date-fns";
import { useGlobalState } from "@/context/globalProvider";
import styled from "styled-components";
import "react-day-picker/dist/style.css";

interface DatePickerProps {
  value: string; // ISO string e.g. "2024-04-15"
  onChange: (dateStr: string) => void;
  placeholder?: string;
}

export default function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
}: DatePickerProps) {
  const { theme } = useGlobalState();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = value
    ? (() => {
        const d = parseISO(value);
        return isValid(d) ? d : undefined;
      })()
    : undefined;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (day: Date | undefined) => {
    if (day) {
      onChange(format(day, "yyyy-MM-dd"));
      setOpen(false);
    }
  };

  return (
    <DatePickerStyled theme={theme} ref={ref}>
      <button
        type="button"
        className={`dp-trigger ${open ? "open" : ""} ${selected ? "has-value" : ""}`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="dp-icon">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </span>
        <span className="dp-label">
          {selected ? format(selected, "MMMM d, yyyy") : placeholder}
        </span>
        <span className="dp-chevron">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {open && (
        <div className="dp-popover">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            showOutsideDays
            fixedWeeks
          />
        </div>
      )}
    </DatePickerStyled>
  );
}

const DatePickerStyled = styled.div`
  position: relative;
  width: 100%;

  /* Trigger button */
  .dp-trigger {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.7rem 0.9rem;
    background: ${(props) => props.theme.colorBg};
    border: 1px solid ${(props) => props.theme.borderColor};
    border-radius: 9px;
    color: ${(props) => props.theme.colorGrey3};
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;

    .dp-icon {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      color: ${(props) => props.theme.colorGrey3};
    }

    .dp-label {
      flex: 1;
    }

    .dp-chevron {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      color: ${(props) => props.theme.colorGrey3};
    }

    &.has-value {
      color: ${(props) => props.theme.colorGrey0};
    }

    &:hover,
    &.open {
      border-color: ${(props) => props.theme.colorPrimary};
      box-shadow: 0 0 0 3px ${(props) => props.theme.colorPrimaryLight};
    }
  }

  /* Popover */
  .dp-popover {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    z-index: 500;
    background: ${(props) => props.theme.colorBg2};
    border: 1px solid ${(props) => props.theme.borderColorAccent};
    border-radius: 12px;
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
    animation: dpIn 0.18s ease forwards;
    overflow: hidden;

    @keyframes dpIn {
      from { opacity: 0; transform: translateY(-6px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
  }

  /* Override react-day-picker styles to match our dark theme */
  .rdp {
    --rdp-cell-size: 36px;
    --rdp-accent-color: ${(props) => props.theme.colorPrimary};
    --rdp-background-color: ${(props) => props.theme.colorPrimaryLight};
    --rdp-accent-color-dark: ${(props) => props.theme.colorPrimary};
    --rdp-background-color-dark: ${(props) => props.theme.colorPrimaryLight};
    --rdp-outline: none;
    --rdp-outline-selected: none;
    margin: 0.5rem;
  }

  .rdp-months {
    justify-content: center;
  }

  .rdp-month {
    background: transparent;
  }

  .rdp-caption {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.25rem 0.5rem;
  }

  .rdp-caption_label {
    font-size: 0.9rem;
    font-weight: 600;
    color: ${(props) => props.theme.colorGrey0};
  }

  .rdp-nav_button {
    width: 28px;
    height: 28px;
    border-radius: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${(props) => props.theme.colorGrey2};
    transition: all 0.15s ease;

    &:hover {
      background: ${(props) => props.theme.colorBg4};
      color: ${(props) => props.theme.colorGrey0};
    }
  }

  .rdp-head_cell {
    font-size: 0.72rem;
    font-weight: 600;
    color: ${(props) => props.theme.colorGrey3};
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .rdp-day {
    width: 36px;
    height: 36px;
    font-size: 0.85rem;
    border-radius: 8px;
    color: ${(props) => props.theme.colorGrey1};
    transition: all 0.15s ease;

    &:hover:not(.rdp-day_selected):not(.rdp-day_outside) {
      background: ${(props) => props.theme.colorBg4};
      color: ${(props) => props.theme.colorGrey0};
    }
  }

  .rdp-day_outside {
    color: ${(props) => props.theme.colorGrey4};
  }

  .rdp-day_today:not(.rdp-day_selected) {
    font-weight: 700;
    color: ${(props) => props.theme.colorPrimary};
    background: ${(props) => props.theme.colorPrimaryLight};
  }

  .rdp-day_selected,
  .rdp-day_selected:hover {
    background: ${(props) => props.theme.colorPrimary} !important;
    color: #fff !important;
    font-weight: 600;
    box-shadow: 0 0 12px ${(props) => props.theme.colorPrimaryGlow};
  }

  .rdp-button:focus-visible {
    outline: 2px solid ${(props) => props.theme.colorPrimary};
    outline-offset: 2px;
  }
`;
