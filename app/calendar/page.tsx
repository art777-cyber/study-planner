"use client";

import { useState } from "react";

export default function CalendarPage() {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const calendarCells = [];

  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push(day);
  }

  const previousMonth = () => {
    if (currentYear === 2026 && currentMonth === 3) return;

    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Calendar</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "400px",
          marginBottom: "20px",
        }}
      >
        <button onClick={previousMonth}>◀ Previous</button>

        <h2>
          {monthNames[currentMonth]} {currentYear}
        </h2>

        <button onClick={nextMonth}>Next ▶</button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 60px)",
          gap: "5px",
        }}
      >
        {daysOfWeek.map((day) => (
          <div
            key={day}
            style={{
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {day}
          </div>
        ))}

        {calendarCells.map((day, index) => (
          <div
            key={index}
            style={{
              border: "1px solid black",
              height: "60px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: day ? "pointer" : "default",
            }}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}