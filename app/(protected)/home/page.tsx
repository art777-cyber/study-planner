"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

type Note = {
  id: number;
  content: string;
};

export default function Home() {
  const router = useRouter();

  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");

  const [selectedNote, setSelectedNote] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  // Load notes from Supabase
  useEffect(() => {
    const fetchNotes = async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("created_at");

      if (error) {
        console.error(error);
        return;
      }

      if (data) {
        setNotes(data);
      }
    };

    fetchNotes();
  }, []);

  // 🔥 LOGOUT FUNCTION (ADDED)
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/"); // change to /login if you have login page
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) return;

    const { error } = await supabase.from("notes").insert({
      user_id: userData.user.id,
      content: newNote,
    });

    if (error) {
      console.error(error);
      return;
    }

    const { data } = await supabase
      .from("notes")
      .select("*")
      .order("created_at");

    if (data) setNotes(data);

    setNewNote("");
  };

  const handleDelete = async () => {
    if (selectedNote === null) return;

    const noteId = notes[selectedNote].id;

    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", noteId);

    if (error) {
      console.error(error);
      return;
    }

    const { data } = await supabase
      .from("notes")
      .select("*")
      .order("created_at");

    if (data) setNotes(data);

    setSelectedNote(null);
  };

  const handleEdit = async () => {
    if (selectedNote === null) return;

    const noteId = notes[selectedNote].id;

    const { error } = await supabase
      .from("notes")
      .update({
        content: editText,
      })
      .eq("id", noteId);

    if (error) {
      console.error(error);
      return;
    }

    const { data } = await supabase
      .from("notes")
      .select("*")
      .order("created_at");

    if (data) setNotes(data);

    setSelectedNote(null);
  };

  return (
    <div className="homepage">
      <h1 className="page-title">Study Planner</h1>

      {/* 🔥 LOGOUT BUTTON ADDED */}
      <button onClick={handleLogout} style={{ marginBottom: "10px" }}>
        Logout
      </button>

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

      <div>
        <input
          type="text"
          placeholder="Enter a note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />

        <br />
        <br />

        <button className="nav-button" onClick={handleAddNote}>
          Add Note
        </button>
      </div>

      <div className="notes-container">
        {notes.map((note, index) => (
          <div
            key={note.id}
            className="note-card"
            onClick={() => {
              setSelectedNote(index);
              setEditText(note.content);
            }}
          >
            {note.content}
          </div>
        ))}
      </div>

      {selectedNote !== null && (
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

          <button onClick={handleEdit}>Save Changes</button>

          <button onClick={handleDelete} style={{ marginLeft: "10px" }}>
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