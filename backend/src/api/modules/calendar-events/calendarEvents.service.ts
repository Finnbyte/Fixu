import { eq } from "drizzle-orm";
import { db } from "../../..";
import { CalendarEvent, calendarEvents } from "../../../../db/schemas/calendarEvents";
import { CreateCalendarEvent } from "./calendarEvents.schema";
import { usersCourses } from "../../../../db/schemas/courses";
import { isSameMonth } from "date-fns";

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

export async function fetchCalendarEventByMonth(
  userId: string,
  year: number,
  month: number
) {
  const events = await fetchCalendarEvents(userId);
  const jsMonthOffset = 1;
  return events.filter((event) =>
    isSameMonth(new Date(event.date), new Date(year, month - jsMonthOffset, 1))
  );
}

export async function createCalendarEvent(calendarEvent: CreateCalendarEvent) {
  await db.insert(calendarEvents).values(calendarEvent);
}

export async function updateCalendarEvent(calendarEvent: CalendarEvent) {
  await db.update(calendarEvents).set({ ...calendarEvent, date: calendarEvent.date as Date }).where(eq(calendarEvents.id, calendarEvent.id));
}

export async function deleteCalendarEvent(calendarEventId: string) {
  await db.delete(calendarEvents).where(eq(calendarEvents.id, calendarEventId));
}