import { eq } from "drizzle-orm";
import { db } from "../../..";
import { calendarEvents } from "../../../../db/schemas/calendarEvents";
import { CreateCalendarEvent } from "./calendarEvents.schema";
import { usersCourses } from "../../../../db/schemas/courses";

export async function fetchCalendarEvents(userId: string) {
  const rows = await db
    .select()
    .from(calendarEvents)
    .leftJoin(usersCourses, eq(usersCourses.courseId, calendarEvents.courseId));

  return rows
    .filter((row) =>
      row.calendar_events.type === "personal" &&
      row.calendar_events.authorId !== userId
        ? false
        : true
    )
    .map((row) => row.calendar_events);
}

export async function createCalendarEvent(calendarEvent: CreateCalendarEvent) {
  await db.insert(calendarEvents).values(calendarEvent);
}