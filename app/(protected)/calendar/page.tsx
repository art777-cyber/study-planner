"use client";

import Link from "next/link";
import { useState } from "react";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString("en-US", {
    month: "long",
  });

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Sunday = 0, Monday = 1, ...
  const firstDay = new Date(year, month, 1).getDay();

  // Empty boxes before the 1st
  const blanks = Array.from({ length: firstDay });

  function prevMonth() {
    if (year === 2026 && month === 3) return; // don't go before April 2026

    setCurrentDate(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>
        {monthName} {year}
      </h1>

      <button onClick={prevMonth}>Previous Month</button>

      <button
        onClick={nextMonth}
        style={{ marginLeft: 20 }}
      >
        Next Month
      </button>

      {/* Weekdays */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7,1fr)",
          gap: 10,
          marginTop: 30,
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      {/* Calendar */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7,1fr)",
          gap: 10,
          marginTop: 10,
        }}
      >
        {/* Empty cells before day 1 */}
        {blanks.map((_, index) => (
          <div key={`blank-${index}`}></div>
        ))}

        {/* Actual days */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;

          return (
            <Link
              key={day}
              href={`/calendar/${year}/${String(month + 1).padStart(
                2,
                "0"
              )}/${String(day).padStart(2, "0")}`}
            >
              <div
                style={{
                  border: "1px solid black",
                  padding: 20,
                  textAlign: "center",
                  cursor: "pointer",
                  minHeight: 60,
                }}
              >
                {day}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}