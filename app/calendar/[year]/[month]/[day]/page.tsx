"use client";

import { use, useEffect, useState } from "react";

export default function DayPage({
  params,
}: {
  params: Promise<{
    year: string;
    month: string;
    day: string;
  }>;
}) {
  const { year, month, day } = use(params);

  const dateKey =
  `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  );

  const weekday = date.toLocaleDateString("en-US", {
    weekday: "long",
  });

  const [schedule, setSchedule] = useState<any>({});
  const [progress, setProgress] = useState<any>({});
  

  useEffect(() => {
    const timetable = JSON.parse(
      localStorage.getItem("timetable") || "{}"
    );

    const overrides = JSON.parse(
      localStorage.getItem("dateOverrides") || "{}"
    );

    const savedProgress = JSON.parse(
      localStorage.getItem("progress") || "{}"
    );

    if (overrides[dateKey]) {
      setSchedule(overrides[dateKey]);
    } else {
      setSchedule(timetable[weekday] || {});
    }

    setProgress(savedProgress[dateKey] || {});
  }, [dateKey, weekday]);

  function updateCheckbox(
    period: string,
    field: string,
    value: boolean
  ) {
    const newProgress = {
      ...progress,
      [period]: {
        ...(progress[period] || {}),
        [field]: value,
      },
    };

    setProgress(newProgress);

    const allProgress = JSON.parse(
      localStorage.getItem("progress") || "{}"
    );

    allProgress[dateKey] = newProgress;

    localStorage.setItem(
      "progress",
      JSON.stringify(allProgress)
    );
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>
        {year}/{month}/{day}
      </h1>

      <h2>{weekday}</h2>

      {Object.keys(schedule).length === 0 ? (
        <p>No classes registered.</p>
      ) : (
        Object.entries(schedule).map(([period, course]: any) => (
          <div
            key={period}
            style={{
              border: "1px solid black",
              padding: "20px",
              marginBottom: "20px",
            }}
          >
            <h3>
              {period}限 - {course}
            </h3>

            <div>
              <label>
                <input
                  type="checkbox"
                  checked={progress[period]?.revised || false}
                  onChange={(e) =>
                    updateCheckbox(
                      period,
                      "revised",
                      e.target.checked
                    )
                  }
                />
                Material Revised
              </label>
            </div>

            <div>
              <label>
                <input
                  type="checkbox"
                  checked={progress[period]?.hwDone || false}
                  onChange={(e) =>
                    updateCheckbox(
                      period,
                      "hwDone",
                      e.target.checked
                    )
                  }
                />
                Homework Done
              </label>
            </div>

            <div>
              <label>
                <input
                  type="checkbox"
                  checked={progress[period]?.hwSubmitted || false}
                  onChange={(e) =>
                    updateCheckbox(
                      period,
                      "hwSubmitted",
                      e.target.checked
                    )
                  }
                />
                Homework Submitted
              </label>
            </div>

            <br />

            <button>Class Material PDF</button>

            <button style={{ marginLeft: "10px" }}>
              Class Notes PDF
            </button>

            <button style={{ marginLeft: "10px" }}>
              Assignments PDF
            </button>
          </div>
        ))
      )}
    </div>
  );
}