export default function TimetablePage() {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];

  const periods = [1, 2, 3, 4, 5];

  return (
    <div>
      <h1>Timetable Registration</h1>

      {days.map((day) => (
        <div key={day}>
          <strong>{day}</strong>

          {periods.map((period) => (
            <input
              key={period}
              type="text"
              placeholder={`${period}限`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}