"use client";

import { useEffect, useState } from "react";

export default function TimetablePage() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const periods = [1, 2, 3, 4, 5];

  const [timetable, setTimetable] = useState<any>({});
  const [savedData, setSavedData] = useState("");

  // LOAD saved data on page refresh
  useEffect(() => {
    const saved = localStorage.getItem("timetable");

    if (saved) {
      setTimetable(JSON.parse(saved));
    }
  }, []);

  const handleChange = (day: string, period: number, value: string) => {
    setTimetable((prev: any) => ({
      ...prev,
      [day]: {
        ...(prev[day] || {}),
        [period]: value,
      },
    }));
  };

  const handleSave = () => {
    localStorage.setItem("timetable", JSON.stringify(timetable));
    setSavedData("Saved locally!");
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