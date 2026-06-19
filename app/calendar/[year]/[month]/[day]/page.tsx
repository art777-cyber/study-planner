export default async function DayPage({
  params,
}: {
  params: Promise<{
    year: string;
    month: string;
    day: string;
  }>;
}) {
  const { year, month, day } = await params;

  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  );

  const weekday = date.toLocaleDateString("en-US", {
    weekday: "long",
  });

  return (
    <div style={{ padding: "30px" }}>
      <h1>
        {year}/{month}/{day}
      </h1>

      <h2>{weekday}</h2>

      <h3>Timetable will go here</h3>
    </div>
  );
}