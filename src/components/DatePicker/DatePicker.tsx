"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  format, addMonths, subMonths,
  startOfMonth, endOfMonth,
  startOfWeek, endOfWeek,
  eachDayOfInterval,
  isSameMonth, isSameDay, isBefore, startOfDay,
} from "date-fns";
import { useGlobalState } from "@/context/globalProvider";
import styled from "styled-components";

interface DatePickerProps {
  value: string;
  onChange: (dateStr: string) => void;
  placeholder?: string;
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const POPOVER_W = 292;
const POPOVER_H = 310; // approx height

export default function DatePicker({ value, onChange, placeholder = "Pick a date" }: DatePickerProps) {
  const { theme } = useGlobalState();
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const [popPos, setPopPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);

  const today = startOfDay(new Date());
  const selected = value ? startOfDay(new Date(value + "T00:00:00")) : null;

  useEffect(() => {
    if (selected) setViewDate(selected);
  }, [value]);

  const calcPos = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    let top: number;
    if (spaceBelow >= POPOVER_H + 8) {
      // Open downward
      top = rect.bottom + 8;
    } else if (spaceAbove >= POPOVER_H + 8) {
      // Open upward
      top = rect.top - POPOVER_H - 8;
    } else {
      // Center vertically as fallback
      top = Math.max(8, (window.innerHeight - POPOVER_H) / 2);
    }

    let left = rect.left;
    if (left + POPOVER_W > window.innerWidth - 8) {
      left = window.innerWidth - POPOVER_W - 8;
    }

    setPopPos({ top, left });
  }, []);

  const handleToggle = () => {
    calcPos();
    setOpen((o) => !o);
  };

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent) {
        if (e.key === "Escape") setOpen(false);
        return;
      }
      const target = e.target as Node;
      const popover = document.getElementById("dp-portal-popover");
      if (triggerRef.current?.contains(target)) return;
      if (popover?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    window.addEventListener("resize", calcPos);
    window.addEventListener("scroll", calcPos, true);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
      window.removeEventListener("resize", calcPos);
      window.removeEventListener("scroll", calcPos, true);
    };
  }, [open, calcPos]);

  const calStart = startOfWeek(startOfMonth(viewDate));
  const calEnd = endOfWeek(endOfMonth(viewDate));
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  // Always show 6 rows (42 cells) so height never changes
  while (days.length < 42) {
    const last = days[days.length - 1];
    const next = new Date(last);
    next.setDate(last.getDate() + 1);
    days.push(next);
  }

  const handleSelect = (day: Date) => {
    if (isBefore(day, today)) return;
    onChange(format(day, "yyyy-MM-dd"));
    setOpen(false);
  };

  const popover = open ? (
    <PortalPopover
      id="dp-portal-popover"
      style={{ top: popPos.top, left: popPos.left }}
      theme={theme}
    >
      {/* Header */}
      <div className="cal-header">
        <button type="button" className="cal-nav" onClick={() => setViewDate(subMonths(viewDate, 1))}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <span className="cal-title">{format(viewDate, "MMMM yyyy")}</span>
        <button type="button" className="cal-nav" onClick={() => setViewDate(addMonths(viewDate, 1))}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Weekday labels */}
      <div className="cal-weekdays">
        {WEEKDAYS.map((d) => <span key={d} className="cal-weekday">{d}</span>)}
      </div>

      {/* Days grid — always 42 cells = 6 rows */}
      <div className="cal-grid">
        {days.map((day) => {
          const isPast = isBefore(day, today);
          const isSelected = selected ? isSameDay(day, selected) : false;
          const isToday = isSameDay(day, today);
          const isCurrentMonth = isSameMonth(day, viewDate);

          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={isPast}
              onClick={() => handleSelect(day)}
              className={[
                "cal-day",
                isSelected ? "selected" : "",
                isToday && !isSelected ? "today" : "",
                !isCurrentMonth ? "outside" : "",
                isPast ? "disabled" : "",
              ].filter(Boolean).join(" ")}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </PortalPopover>
  ) : null;

  return (
    <DatePickerStyled theme={theme}>
      <button
        ref={triggerRef}
        type="button"
        className={`dp-trigger ${open ? "open" : ""} ${selected ? "has-value" : ""}`}
        onClick={handleToggle}
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
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      {typeof window !== "undefined" && createPortal(popover, document.body)}
    </DatePickerStyled>
  );
}

/* ─── Trigger button styles ─────────────────────────────────────── */
const DatePickerStyled = styled.div`
  position: relative;
  width: 100%;

  .dp-trigger {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.7rem 0.9rem;
    background: ${(p) => p.theme.colorBg};
    border: 1px solid ${(p) => p.theme.borderColor};
    border-radius: 9px;
    color: ${(p) => p.theme.colorGrey3};
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;

    .dp-icon, .dp-chevron {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      color: ${(p) => p.theme.colorGrey3};
    }
    .dp-label { flex: 1; }

    &.has-value { color: ${(p) => p.theme.colorGrey0}; }

    &:hover, &.open {
      border-color: ${(p) => p.theme.colorPrimary};
      box-shadow: 0 0 0 3px ${(p) => p.theme.colorPrimaryLight};
    }
  }
`;

/* ─── Portal popover (rendered on document.body) ────────────────── */
const PortalPopover = styled.div<{ theme: any }>`
  position: fixed;
  z-index: 99999;
  background: ${(p) => p.theme.colorBg2};
  border: 1px solid ${(p) => p.theme.borderColorAccent};
  border-radius: 14px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.45), 0 4px 16px rgba(0,0,0,0.2);
  padding: 0.8rem;
  width: ${POPOVER_W}px;
  animation: dpIn 0.18s ease forwards;

  @keyframes dpIn {
    from { opacity: 0; transform: scale(0.97) translateY(4px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  /* Header */
  .cal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.6rem;
    padding: 0 0.1rem;
  }

  .cal-title {
    font-size: 0.92rem;
    font-weight: 700;
    color: ${(p) => p.theme.colorGrey0};
    letter-spacing: 0.01em;
  }

  .cal-nav {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${(p) => p.theme.colorGrey2};
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
      background: ${(p) => p.theme.colorBg4};
      color: ${(p) => p.theme.colorGrey0};
    }
  }

  /* Weekdays */
  .cal-weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    margin-bottom: 0.25rem;
  }

  .cal-weekday {
    text-align: center;
    font-size: 0.68rem;
    font-weight: 700;
    color: ${(p) => p.theme.colorGrey3};
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 0.2rem 0;
  }

  /* Grid — fixed 6 rows */
  .cal-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 2px;
  }

  .cal-day {
    aspect-ratio: 1;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    font-size: 0.82rem;
    font-weight: 500;
    color: ${(p) => p.theme.colorGrey1};
    cursor: pointer;
    transition: background 0.12s ease, color 0.12s ease;

    &:hover:not(:disabled):not(.selected) {
      background: ${(p) => p.theme.colorBg4};
      color: ${(p) => p.theme.colorGrey0};
    }

    &.today {
      color: ${(p) => p.theme.colorPrimary};
      background: ${(p) => p.theme.colorPrimaryLight};
      font-weight: 700;
    }

    &.selected {
      background: ${(p) => p.theme.colorPrimary};
      color: #fff;
      font-weight: 700;
      box-shadow: 0 0 10px ${(p) => p.theme.colorPrimaryGlow};
    }

    &.outside {
      color: ${(p) => p.theme.colorGrey4};
      opacity: 0.5;
    }

    &:disabled, &.disabled {
      color: ${(p) => p.theme.colorGrey4};
      opacity: 0.3;
      cursor: not-allowed;
    }
  }
`;
