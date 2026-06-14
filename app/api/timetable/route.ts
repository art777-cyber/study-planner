import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { timetable } = await req.json();

  const entries: any[] = [];

  for (const day in timetable) {
    for (const period in timetable[day]) {
      const course = timetable[day][period];

      if (course) {
        entries.push({
          day,
          period: Number(period),
          course,
        });
      }
    }
  }

  await prisma.timetableEntry.createMany({
    data: entries,
  });

  return Response.json({ ok: true, saved: entries.length });
}