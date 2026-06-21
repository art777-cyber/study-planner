"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState("");

  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [editText, setEditText] = useState("");

  // -------------------------
  // AUTH CHECK
  // -------------------------
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
        return;
      }

      setUserId(data.user.id);
      setLoading(false);
    };

    getUser();
  }, [router]);

  // -------------------------
  // LOAD NOTES
  // -------------------------
  useEffect(() => {
    if (!userId) return;

    const loadNotes = async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.log("LOAD ERROR:", error.message);
        return;
      }

      setNotes(data || []);
    };

    loadNotes();
  }, [userId]);

  // -------------------------
  // ADD NOTE
  // -------------------------
  const handleAddNote = async () => {
    if (!userId || !newNote.trim()) return;

    const { data, error } = await supabase
      .from("notes")
      .insert([
        {
          user_id: userId,
          content: newNote,
        },
      ])
      .select();

    if (error) {
      console.log("INSERT ERROR:", error.message);
      return;
    }

    if (data) {
      setNotes([data[0], ...notes]);
    }

    setNewNote("");
  };

  // -------------------------
  // DELETE NOTE
  // -------------------------
  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", id);

    if (error) {
      console.log("DELETE ERROR:", error.message);
      return;
    }

    setNotes(notes.filter((n) => n.id !== id));
    setSelectedNote(null);
  };

  // -------------------------
  // EDIT NOTE
  // -------------------------
  const handleEdit = async () => {
    if (!selectedNote) return;

    const { error } = await supabase
      .from("notes")
      .update({ content: editText })
      .eq("id", selectedNote.id);

    if (error) {
      console.log("UPDATE ERROR:", error.message);
      return;
    }

    setNotes(
      notes.map((n) =>
        n.id === selectedNote.id
          ? { ...n, content: editText }
          : n
      )
    );

    setSelectedNote(null);
  };

  // -------------------------
  // LOADING STATE
  // -------------------------
  if (loading) {
    return <p style={{ padding: 30 }}>Loading...</p>;
  }

  // -------------------------
  // UI
  // -------------------------
  return (
    <div className="homepage">
      <h1 className="page-title">Study Planner</h1>

      <div className="button-group">
        <Link href="/timetable">
          <button className="nav-button">Timetable</button>
        </Link>

        <Link href="/calendar">
          <button className="nav-button">Calendar</button>
        </Link>

        <Link href="/credits">
          <button className="nav-button">Credit Tracker</button>
        </Link>
      </div>

      <h2 className="section-title">Sticky Notes</h2>

      <input
        type="text"
        placeholder="Enter a note..."
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        
      />
      <></>
      <br /><br />

      <button className="nav-button" onClick={handleAddNote}>
        Add Note
      </button>

      <div className="notes-container">
        {notes.map((note) => (
          <div
            key={note.id}
            className="note-card"
            onClick={() => {
              setSelectedNote(note);
              setEditText(note.content);
            }}
          >
            {note.content}
          </div>
        ))}
      </div>

      {selectedNote && (
        <div
          style={{
            position: "fixed",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "white",
            padding: "20px",
            border: "1px solid black",
            zIndex: 1000,
          }}
        >
          <h3>Edit Note</h3>

          <input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />

          <br />
          <br />

          <button onClick={handleEdit}>Save</button>

          <button
            onClick={() => handleDelete(selectedNote.id)}
            style={{ marginLeft: "10px" }}
          >
            Delete
          </button>

          <br />
          <br />

          <button onClick={() => setSelectedNote(null)}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}