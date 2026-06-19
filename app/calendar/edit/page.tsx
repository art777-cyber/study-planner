"use client";

import { useState } from "react";

export default function EditTimetablePage() {
  const [selectedDate, setSelectedDate] = useState("");
  const [schedule, setSchedule] = useState<any>({});

  function loadDate(dateString: string) {
    setSelectedDate(dateString);

    const timetable = JSON.parse(
      localStorage.getItem("timetable") || "{}"
    );

    const overrides = JSON.parse(
      localStorage.getItem("dateOverrides") || "{}"
    );

    const date = new Date(dateString);

    const weekday = date.toLocaleDateString("en-US", {
      weekday: "long",
    });

    if (overrides[dateString]) {
      setSchedule(overrides[dateString]);
    } else {
      setSchedule({
        ...(timetable[weekday] || {}),
      });
    }
  }

  function updatePeriod(period: string, value: string) {
    setSchedule({
      ...schedule,
      [period]: value,
    });
  }

  function saveOverride() {
    if (!selectedDate) return;

    const overrides = JSON.parse(
      localStorage.getItem("dateOverrides") || "{}"
    );

    overrides[selectedDate] = schedule;

    localStorage.setItem(
      "dateOverrides",
      JSON.stringify(overrides)
    );

    alert("Saved!");
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Edit Timetable</h1>

      <input
        type="date"
        value={selectedDate}
        onChange={(e) => loadDate(e.target.value)}
      />

      <br />
      <br />

      {Object.entries(schedule).map(([period, course]: any) => (
        <div
          key={period}
          style={{
            marginBottom: "15px",
          }}
        >
          {period}限

          <input
            type="text"
            value={course}
            onChange={(e) =>
              updatePeriod(period, e.target.value)
            }
            style={{
              marginLeft: "10px",
            }}
          />
        </div>
      ))}

      {selectedDate && (
        <button onClick={saveOverride}>
          Save Changes
        </button>
      )}
    </div>
  );
}