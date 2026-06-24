"use client";

import { use, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type FileItem = {
  user_id: string;
  date: string;
  period: string;
  type: string;
  file_path: string;
  url: string;
};

export default function DayPage({
  params,
}: {
  params: Promise<{ year: string; month: string; day: string }>;
}) {
  const { year, month, day } = use(params);

  const dateKey = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

  const date = new Date(Number(year), Number(month) - 1, Number(day));

  const weekday = date.toLocaleDateString("en-US", {
    weekday: "long",
  });

  const [userId, setUserId] = useState<string | null>(null);

  const [schedule, setSchedule] = useState<any>({});
  const [editSchedule, setEditSchedule] = useState<any>({});
  const [editing, setEditing] = useState(false);

  const [progress, setProgress] = useState<any>({});
  const [files, setFiles] = useState<FileItem[]>([]);

  // ---------------- AUTH ----------------
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) setUserId(data.user.id);
    };
    loadUser();
  }, []);

  // ---------------- LOAD DATA ----------------
  useEffect(() => {
    if (!userId) return;

    const load = async () => {
      // timetable
      const { data: timetableData } = await supabase
        .from("timetable")
        .select("*")
        .eq("user_id", userId);

      const timetable: any = {};

      timetableData?.forEach((row: any) => {
        if (!timetable[row.day]) timetable[row.day] = {};
        timetable[row.day][row.period] = row.subject;
      });

      const baseSchedule = timetable[weekday] || {};

      // ---------------- OVERRIDES ----------------
      const { data: overrideData } = await supabase
        .from("calendar_overrides")
        .select("*")
        .eq("user_id", userId)
        .eq("date", dateKey);

      if (overrideData && overrideData.length > 0) {
        const overridden: any = {};

        overrideData.forEach((row: any) => {
          overridden[row.period] = row.subject;
        });

        setSchedule(overridden);
        setEditSchedule(overridden);
      } else {
        setSchedule(baseSchedule);
        setEditSchedule(baseSchedule);
      }

      // ---------------- PROGRESS ----------------
      const { data: progressData } = await supabase
        .from("calendar_progress")
        .select("*")
        .eq("user_id", userId)
        .eq("date", dateKey);

      const formatted: any = {};

      progressData?.forEach((row: any) => {
        formatted[row.period] = {
          revised: row.revised,
          hwDone: row.hw_done,
          hwSubmitted: row.hw_submitted,
        };
      });

      setProgress(formatted);

      // ---------------- FILES ----------------
      const { data: fileData } = await supabase
        .from("class_files")
        .select("*")
        .eq("user_id", userId)
        .eq("date", dateKey);

      const withUrls: FileItem[] =
        fileData?.map((file: any) => ({
          ...file,
          url: supabase.storage
            .from("class-files")
            .getPublicUrl(file.file_path).data.publicUrl,
        })) || [];

      setFiles(withUrls);
    };

    load();
  }, [userId, dateKey, weekday]);

  // ---------------- SAVE OVERRIDE ----------------
  async function saveOverride() {
    if (!userId) return;

    await supabase
      .from("calendar_overrides")
      .delete()
      .eq("user_id", userId)
      .eq("date", dateKey);

    const rows = Object.entries(editSchedule).map(
      ([period, subject]: any) => ({
        user_id: userId,
        date: dateKey,
        period,
        subject,
      })
    );

    await supabase.from("calendar_overrides").insert(rows);

    setSchedule(editSchedule);
    setEditing(false);
  }

  // ---------------- CHECKBOX ----------------
  async function updateCheckbox(
    period: string,
    field: string,
    value: boolean
  ) {
    if (!userId) return;

    const updated = {
      ...progress,
      [period]: {
        ...(progress[period] || {}),
        [field]: value,
      },
    };

    setProgress(updated);

    const row = updated[period];

    await supabase.from("calendar_progress").upsert(
      {
        user_id: userId,
        date: dateKey,
        period,
        revised: row?.revised || false,
        hw_done: row?.hwDone || false,
        hw_submitted: row?.hwSubmitted || false,
      },
      { onConflict: "user_id,date,period" }
    );
  }

  // ---------------- FILE UPLOAD ----------------
  async function uploadFile(
    file: File,
    period: string,
    type: string
  ) {
    if (!userId) return;

    const filePath = `${userId}/${dateKey}/${period}/${type}-${file.name}`;

    const { error } = await supabase.storage
      .from("class-files")
      .upload(filePath, file, { upsert: true });

    if (error) return;

    await supabase.from("class_files").insert({
      user_id: userId,
      date: dateKey,
      period,
      type,
      file_path: filePath,
    });

    const { data } = supabase.storage
      .from("class-files")
      .getPublicUrl(filePath);

    setFiles((prev) => [
      ...prev,
      {
        user_id: userId,
        date: dateKey,
        period,
        type,
        file_path: filePath,
        url: data.publicUrl,
      },
    ]);
  }

  // ---------------- DELETE FILE ----------------
  async function deleteFile(filePath: string) {
    if (!userId) return;

    await supabase.storage.from("class-files").remove([filePath]);

    await supabase
      .from("class_files")
      .delete()
      .eq("file_path", filePath)
      .eq("user_id", userId);

    setFiles((prev) => prev.filter((f) => f.file_path !== filePath));
  }

  if (!userId) return <p style={{ padding: 30 }}>Not logged in</p>;

  return (
    <div style={{ padding: 30 }}>
      <h1>
        {year}/{month}/{day}
      </h1>
      <h2>{weekday}</h2>

      {/* EDIT BUTTON */}
      <button onClick={() => setEditing(!editing)}>
        {editing ? "Close Edit Timetable" : "Edit Timetable"}
      </button>

      {/* EDIT PANEL */}
      {editing && (
        <div style={{ border: "1px solid black", padding: 20, marginTop: 20 }}>
          <h3>Edit Timetable for this date</h3>

          {Object.entries(editSchedule).map(([period, subject]: any) => (
            <div key={period} style={{ marginBottom: 10 }}>
              <b>{period}</b>

              <input
                style={{ marginLeft: 10 }}
                value={subject}
                onChange={(e) =>
                  setEditSchedule({
                    ...editSchedule,
                    [period]: e.target.value,
                  })
                }
              />
            </div>
          ))}

          <button onClick={saveOverride}>Save Changes</button>
        </div>
      )}

      {/* SCHEDULE */}
      {Object.entries(schedule).map(([period, course]: any) => (
        <div
          key={period}
          style={{
            border: "1px solid black",
            padding: 20,
            marginBottom: 20,
          }}
        >
          <h3>
            {period} - {course}
          </h3>

          <label>
            <input
              type="checkbox"
              checked={progress[period]?.revised || false}
              onChange={(e) =>
                updateCheckbox(period, "revised", e.target.checked)
              }
            />
            Revised
          </label>

          <br />

          <label>
            <input
              type="checkbox"
              checked={progress[period]?.hwDone || false}
              onChange={(e) =>
                updateCheckbox(period, "hwDone", e.target.checked)
              }
            />
            Homework Done
          </label>

          <br />

          <label>
            <input
              type="checkbox"
              checked={progress[period]?.hwSubmitted || false}
              onChange={(e) =>
                updateCheckbox(period, "hwSubmitted", e.target.checked)
              }
            />
            Submitted
          </label>

          <hr />

          <button
            onClick={() => document.getElementById(`mat-${period}`)?.click()}
          >
            Upload Class Material
          </button>
          <input
            hidden
            id={`mat-${period}`}
            type="file"
            onChange={(e) =>
              e.target.files?.[0] &&
              uploadFile(e.target.files[0], period, "material")
            }
          />

          <br />

          <button
            onClick={() =>
              document.getElementById(`notes-${period}`)?.click()
            }
          >
            Upload Notes
          </button>
          <input
            hidden
            id={`notes-${period}`}
            type="file"
            onChange={(e) =>
              e.target.files?.[0] &&
              uploadFile(e.target.files[0], period, "notes")
            }
          />

          <br />

          <button
            onClick={() => document.getElementById(`asg-${period}`)?.click()}
          >
            Upload Assignments
          </button>
          <input
            hidden
            id={`asg-${period}`}
            type="file"
            onChange={(e) =>
              e.target.files?.[0] &&
              uploadFile(e.target.files[0], period, "assignments")
            }
          />

          {/* FILES */}
          <div style={{ marginTop: 10 }}>
            {files
              .filter((f) => f.period === period)
              .map((file) => (
                <div key={file.file_path}>
                  <a href={file.url} target="_blank">
                    📄 {file.type.toUpperCase()}
                  </a>

                  <button
                    onClick={() => deleteFile(file.file_path)}
                    style={{ marginLeft: 10 }}
                  >
                    Delete
                  </button>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}