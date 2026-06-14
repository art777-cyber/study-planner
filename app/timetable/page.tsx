"use client";

import { useState } from "react";

export default function TimetablePage() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const periods = [1, 2, 3, 4, 5];

  const [timetable, setTimetable] = useState<any>({});
  const [savedData, setSavedData] = useState("");

  const handleChange = (day: string, period: number, value: string) => {
    setTimetable((prev: any) => ({
      ...prev,
      [day]: {
        ...(prev[day] || {}),
        [period]: value,
      },
    }));
  };

  const handleSave = async () => {
    console.log("🟡 Save clicked");

    const res = await fetch("/api/timetable", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ timetable }),
    });

    const data = await res.json();

    console.log("🟢 API RESPONSE:", data);

    setSavedData("Saved!");
  };

  return (
    <div>
      <h1>Timetable Registration</h1>

      <table>
        <thead>
          <tr>
            <th></th>
            {periods.map((p) => (
              <th key={p}>{p}限</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {days.map((day) => (
            <tr key={day}>
              <td>{day}</td>

              {periods.map((period) => (
                <td key={period}>
                  <input
                    type="text"
                    value={timetable?.[day]?.[period] || ""}
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

      <button onClick={handleSave}>Save Timetable</button>

      <p>{savedData}</p>
    </div>
  );
}