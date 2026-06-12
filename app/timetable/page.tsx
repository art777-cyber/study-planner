"use client";

import { useState } from "react";

export default function TimetablePage() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const periods = [1, 2, 3, 4, 5];

  // Generate initial empty timetable
  const initialTimetable: Record<string, Record<number, string>> = {};
  days.forEach((day) => {
    initialTimetable[day] = {};
    periods.forEach((period) => {
      initialTimetable[day][period] = "";
    });
  });

  const [timetable, setTimetable] = useState(initialTimetable);
  const [savedData, setSavedData] = useState("");

  // Update a specific period for a specific day
  const handleChange = (day: string, period: number, value: string) => {
    setTimetable((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [period]: value,
      },
    }));
  };

  const handleSave = () => {
    console.log("Timetable saved:", timetable);
    setSavedData("Timetable saved!");
  };

  return (
    <div className="timetable-page">
      <h1>Timetable Registration</h1>

      <table className="timetable-table">
        <thead>
          <tr>
            <th></th>
            {periods.map((period) => (
              <th key={period}>{period}限</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {days.map((day) => (
            <tr key={day}>
              <td className="day-label">{day}</td>
              {periods.map((period) => (
                <td key={period}>
                  <input
                    type="text"
                    placeholder="Course"
                    value={timetable[day][period]}
                    onChange={(e) =>
                      handleChange(day, period, e.target.value)
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <button className="save-button" onClick={handleSave}>
        Save Timetable
      </button>
      <p>{savedData}</p>
      
    </div>
  );
}