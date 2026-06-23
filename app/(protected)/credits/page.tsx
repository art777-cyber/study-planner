"use client";

import { useEffect, useState } from "react";

type CreditRow = {
  category: string;
  required: number;
  completed: number;
  inProgress: number;
};

export default function CreditsPage() {
  const [rows, setRows] = useState<CreditRow[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("creditTracker");

    if (saved) {
      setRows(JSON.parse(saved));
    } else {
      const initialRows: CreditRow[] = Array.from({ length: 15 }, () => ({
        category: "",
        required: 0,
        completed: 0,
        inProgress: 0,
      }));

      setRows(initialRows);
    }
  }, []);

  function updateRow(
    index: number,
    field: keyof CreditRow,
    value: string | number
  ) {
    const newRows = [...rows];

    if (
      field === "required" ||
      field === "completed" ||
      field === "inProgress"
    ) {
      newRows[index][field] = Number(value);
    } else {
      newRows[index][field] = value as string;
    }

    setRows(newRows);
  }

  function addRow() {
    setRows([
      ...rows,
      {
        category: "",
        required: 0,
        completed: 0,
        inProgress: 0,
      },
    ]);
  }

  function deleteRow(index: number) {
    setRows(rows.filter((_, i) => i !== index));
  }

  function saveProgress() {
    localStorage.setItem("creditTracker", JSON.stringify(rows));
    alert("Progress saved!");
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Credit Tracker</h1>

      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          textAlign: "center",
        }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid black", padding: "10px" }}>
              Subject Category
            </th>

            <th style={{ border: "1px solid black", padding: "10px" }}>
              Required Credits
            </th>

            <th style={{ border: "1px solid black", padding: "10px" }}>
              Completed Credits
            </th>

            <th style={{ border: "1px solid black", padding: "10px" }}>
              In Progress Credits
            </th>

            <th style={{ border: "1px solid black", padding: "10px" }}>
              Remaining Credits
            </th>

            <th style={{ border: "1px solid black", padding: "10px" }}>
              Delete
            </th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td style={{ border: "1px solid black", padding: "5px" }}>
                <input
                  type="text"
                  value={row.category}
                  onChange={(e) =>
                    updateRow(index, "category", e.target.value)
                  }
                  style={{ width: "95%" }}
                />
              </td>

              <td style={{ border: "1px solid black", padding: "5px" }}>
                <input
                  type="number"
                  value={row.required}
                  onChange={(e) =>
                    updateRow(index, "required", e.target.value)
                  }
                  style={{ width: "70px" }}
                />
              </td>

              <td style={{ border: "1px solid black", padding: "5px" }}>
                <input
                  type="number"
                  value={row.completed}
                  onChange={(e) =>
                    updateRow(index, "completed", e.target.value)
                  }
                  style={{ width: "70px" }}
                />
              </td>

              <td style={{ border: "1px solid black", padding: "5px" }}>
                <input
                  type="number"
                  value={row.inProgress}
                  onChange={(e) =>
                    updateRow(index, "inProgress", e.target.value)
                  }
                  style={{ width: "70px" }}
                />
              </td>

              <td style={{ border: "1px solid black", padding: "5px" }}>
                {row.required - row.completed - row.inProgress}
              </td>

              <td style={{ border: "1px solid black", padding: "5px" }}>
                <button onClick={() => deleteRow(index)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />

      <button onClick={addRow}>
        Add Row
      </button>

      <button
        onClick={saveProgress}
        style={{ marginLeft: "20px" }}
      >
        Save Progress
      </button>
    </div>
  );
}