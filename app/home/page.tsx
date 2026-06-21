"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function Home() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [notes, setNotes] = useState<string[]>([]);
  const [newNote, setNewNote] = useState("");

  const [selectedNote, setSelectedNote] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  // 🔐 AUTH CHECK (IMPORTANT)
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  // NOTES LOAD (STILL LOCAL FOR NOW)
  useEffect(() => {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) setNotes(JSON.parse(savedNotes));
  }, []);

  const saveNotes = (updatedNotes: string[]) => {
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const updatedNotes = [...notes, newNote];
    saveNotes(updatedNotes);
    setNewNote("");
  };

  const handleDelete = () => {
    if (selectedNote === null) return;

    const updatedNotes = notes.filter((_, index) => index !== selectedNote);
    saveNotes(updatedNotes);
    setSelectedNote(null);
  };

  const handleEdit = () => {
    if (selectedNote === null) return;

    const updatedNotes = [...notes];
    updatedNotes[selectedNote] = editText;
    saveNotes(updatedNotes);
    setSelectedNote(null);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

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

      <div>
        <input
          type="text"
          placeholder="Enter a note..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />

        <br /><br />

        <button className="nav-button" onClick={handleAddNote}>
          Add Note
        </button>
      </div>

      <div className="notes-container">
        {notes.map((note, index) => (
          <div
            key={index}
            className="note-card"
            onClick={() => {
              setSelectedNote(index);
              setEditText(note);
            }}
          >
            {note}
          </div>
        ))}
      </div>

      {selectedNote !== null && (
        <div style={{
          position: "fixed",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "white",
          padding: "20px",
          border: "1px solid black",
          zIndex: 1000,
        }}>
          <h3>Edit Note</h3>

          <input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />

          <br /><br />

          <button onClick={handleEdit}>Save Changes</button>

          <button onClick={handleDelete} style={{ marginLeft: "10px" }}>
            Delete
          </button>

          <br /><br />

          <button onClick={() => setSelectedNote(null)}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}