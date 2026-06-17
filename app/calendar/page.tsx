"use client";

import Link from "next/link";

export default function CalendarPage() {
  const year = 2026;
  const month = 5; // June (0 = Jan)

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: (number | null)[] = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>June 2026</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "10px",
          maxWidth: "700px",
        }}
      >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
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

        {days.map((day, index) => (
          <div
            key={index}
            style={{
              border: "1px solid black",
              minHeight: "80px",
              padding: "8px",
              textAlign: "center",
            }}
          >
            {day && (
              <Link
                href={`/calendar/2026-06-${String(day).padStart(2, "0")}`}
              >
                {day}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}