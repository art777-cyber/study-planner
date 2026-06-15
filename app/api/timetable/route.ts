export async function POST(req: Request) {
  const { timetable } = await req.json();

  console.log("📦 Timetable received:");
  console.log(timetable);

  return Response.json({
    ok: true,
    message: "Timetable received successfully",
  });
}