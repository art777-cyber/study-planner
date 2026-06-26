"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type CreditRow = {
  id?: string;
  category: string;
  required: number;
  completed: number;
  inProgress: number;
};

export default function CreditsPage() {
  const [rows, setRows] = useState<CreditRow[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // ---------------- GET USER ----------------
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (user) {
        setUserId(user.id);
        loadCredits(user.id);
      }
    };

    getUser();
  }, []);

  // ---------------- LOAD FROM SUPABASE ----------------
  async function loadCredits(uid: string) {
    const { data, error } = await supabase
      .from("credit_tracker")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: true });

    if (error) return;

    if (data && data.length > 0) {
      setRows(
        data.map((r) => ({
          id: r.id,
          category: r.category,
          required: r.required,
          completed: r.completed,
          inProgress: r.in_progress,
        }))
      );
    } else {
      // initial empty rows
      setRows(
        Array.from({ length: 15 }, () => ({
          category: "",
          required: 0,
          completed: 0,
          inProgress: 0,
        }))
      );
    }
  }

  // ---------------- UPDATE ROW ----------------
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

  // ---------------- ADD ROW ----------------
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

  // ---------------- DELETE ROW ----------------
  async function deleteRow(index: number) {
    const row = rows[index];

    if (row.id) {
      await supabase.from("credit_tracker").delete().eq("id", row.id);
    }

    setRows(rows.filter((_, i) => i !== index));
  }

  // ---------------- SAVE ----------------
  async function saveProgress() {
    if (!userId) return;

    // delete old rows
    await supabase.from("credit_tracker").delete().eq("user_id", userId);

    // insert fresh rows
    const payload = rows.map((r) => ({
      user_id: userId,
      category: r.category,
      required: r.required,
      completed: r.completed,
      in_progress: r.inProgress,
    }));

    const { error } = await supabase
      .from("credit_tracker")
      .insert(payload);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Saved to Supabase!");
    loadCredits(userId);
  }

  if (!userId) return <p style={{ padding: 30 }}>Loading...</p>;

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
            <th>Subject Category</th>
            <th>Required Credits</th>
            <th>Completed Credits</th>
            <th>In Progress Credits</th>
            <th>Remaining</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>
                <input
                  value={row.category}
                  onChange={(e) =>
                    updateRow(index, "category", e.target.value)
                  }
                />
              </td>

              <td>
                <input
                  type="number"
                  value={row.required}
                  onChange={(e) =>
                    updateRow(index, "required", e.target.value)
                  }
                />
              </td>

              <td>
                <input
                  type="number"
                  value={row.completed}
                  onChange={(e) =>
                    updateRow(index, "completed", e.target.value)
                  }
                />
              </td>

              <td>
                <input
                  type="number"
                  value={row.inProgress}
                  onChange={(e) =>
                    updateRow(index, "inProgress", e.target.value)
                  }
                />
              </td>

              <td>
                {row.required - row.completed - row.inProgress}
              </td>

              <td>
                <button onClick={() => deleteRow(index)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />

      <button onClick={addRow}>Add Row</button>

      <button onClick={saveProgress} style={{ marginLeft: "20px" }}>
        Save Progress
      </button>
    </div>
  );
}