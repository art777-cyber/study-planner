"use client";

import { useEffect, useState } from "react";

export default function CalendarPage() {
  const [timetable, setTimetable] = useState<any>({});

  useEffect(() => {
    const saved = localStorage.getItem("timetable");

    if (saved) {
      setTimetable(JSON.parse(saved));
    }
  }, []);

  return (
    <div>
      <h1>Calendar</h1>

      {Object.keys(timetable).length === 0 ? (
        <p>No timetable saved yet.</p>
      ) : (
        Object.entries(timetable).map(([day, periods]: any) => (
          <div
            key={day}
            style={{
              border: "1px solid black",
              padding: "10px",
              marginBottom: "15px",
            }}
          >
            <h2>{day}</h2>

            {Object.entries(periods).map(([period, course]: any) => (
              <p key={period}>
                {period}限 - {course}
              </p>
            ))}
          </div>
        ))
      )}
    </div>
  );
}