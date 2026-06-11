import Link from "next/link";

export default function Home() {
  return (
    <div className="homepage">
      <h1 className="page-title">Arya's Study Planner</h1>

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

      <button className="nav-button">Add Note</button>

      <div className="notes-container">
        <div className="note-card">NLP Homework</div>
        <div className="note-card">Lab Report</div>
        <div className="note-card">Exam Friday</div>
      </div>
    </div>
  );
}