"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function TimetablePage() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const periods = [1, 2, 3, 4, 5];

  const [timetable, setTimetable] = useState<any>({});
  const [user, setUser] = useState<any>(null);
  const [status, setStatus] = useState("");

  // 🔐 GET USER
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);

      if (data.user) {
        loadTimetable(data.user.id);
      }
    };

    getUser();
  }, []);

  // 📥 LOAD FROM SUPABASE
  async function loadTimetable(userId: string) {
    const { data } = await supabase
      .from("timetable")
      .select("*")
      .eq("user_id", userId);

    const formatted: any = {};

    data?.forEach((row) => {
      if (!formatted[row.day]) formatted[row.day] = {};
      formatted[row.day][row.period] = row.subject;
    });

    setTimetable(formatted);
  }

  // ✏️ UPDATE LOCAL STATE
  const handleChange = (day: string, period: number, value: string) => {
    setTimetable((prev: any) => ({
      ...prev,
      [day]: {
        ...(prev[day] || {}),
        [period]: value,
      },
    }));
  };

  // 💾 SAVE TO SUPABASE
  const handleSave = async () => {
    if (!user) return;

    // delete old rows first
    await supabase
      .from("timetable")
      .delete()
      .eq("user_id", user.id);

    // insert new rows
    const rows: any[] = [];

    Object.entries(timetable).forEach(([day, periodsObj]: any) => {
      Object.entries(periodsObj).forEach(([period, subject]) => {
        rows.push({
          user_id: user.id,
          day,
          period: Number(period),
          subject,
        });
      });
    });

    const { error } = await supabase.from("timetable").insert(rows);

    if (error) {
      setStatus(error.message);
    } else {
      setStatus("Saved!");
    }
  };

  if (!user) {
    return <p>Loading user...</p>;
  }

  return (
    <div>
      <h1>Timetable</h1>

      <table border={1}>
        <thead>
          <tr>
            <th></th>
            {periods.map((p) => (
              <th key={p}>{p}</th>
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

      <br />

      <button onClick={handleSave}>
        Save
      </button>

      <p>{status}</p>
    </div>
  );
}