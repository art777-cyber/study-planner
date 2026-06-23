"use client";

import { use, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

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
  const [progress, setProgress] = useState<any>({});
  const [files, setFiles] = useState<any[]>([]);

  // ---------------- AUTH ----------------
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;
      setUserId(data.user.id);
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

      setSchedule(timetable[weekday] || {});

      // progress (checkboxes)
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

      // files
      const { data: fileData } = await supabase
        .from("class_files")
        .select("*")
        .eq("user_id", userId)
        .eq("date", dateKey);

      const withUrls =
        fileData?.map((file: any) => {
          const { data } = supabase.storage
            .from("class-files")
            .getPublicUrl(file.file_path);

          return {
            ...file,
            url: data.publicUrl,
          };
        }) || [];

      setFiles(withUrls);
    };

    load();
  }, [userId, dateKey, weekday]);

  // ---------------- CHECKBOX SAVE ----------------
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
      {
        onConflict: "user_id,date,period",
      }
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

    const { error: uploadError } = await supabase.storage
      .from("class-files")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.log(uploadError.message);
      return;
    }

    const { error: dbError } = await supabase
      .from("class_files")
      .insert({
        user_id: userId,
        date: dateKey,
        period,
        type,
        file_path: filePath,
      });

    if (dbError) {
      console.log(dbError.message);
      return;
    }

    // refresh file list instantly (NO reload needed)
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

  if (!userId) return <p style={{ padding: 30 }}>Not logged in</p>;

  return (
    <div style={{ padding: 30 }}>
      <h1>
        {year}/{month}/{day}
      </h1>
      <h2>{weekday}</h2>

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

          {/* CHECKBOXES */}
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

          {/* FILE UPLOAD BUTTONS (NO file text shown) */}

          <button
            onClick={() =>
              document.getElementById(`mat-${period}`)?.click()
            }
          >
            Upload Class Material
          </button>
          <input
            id={`mat-${period}`}
            type="file"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadFile(file, period, "material");
            }}
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
            id={`notes-${period}`}
            type="file"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadFile(file, period, "notes");
            }}
          />

          <br />

          <button
            onClick={() =>
              document.getElementById(`asg-${period}`)?.click()
            }
          >
            Upload Assignments
          </button>
          <input
            id={`asg-${period}`}
            type="file"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadFile(file, period, "assignments");
            }}
          />

          {/* FILE LINKS (ONLY CLEAN LINKS SHOWN) */}
          <div style={{ marginTop: 10 }}>
            {files
              .filter((f) => f.period === period)
              .map((file) => (
                <div key={file.file_path}>
                  <a href={file.url} target="_blank">
                    📄 {file.type.toUpperCase()}
                  </a>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}