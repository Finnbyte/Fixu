import { eq } from "drizzle-orm";
import { db } from "../../..";
import { calendarEvents } from "../../../../db/schemas/calendarEvents";
import { CreateCalendarEvent } from "./calendarEvents.schema";

export async function fetchCalendarEvents(userId: string) {
  return await db
    .select()
    .from(calendarEvents)
    .where(eq(calendarEvents.attendee, userId));
}

export async function createCalendarEvent(calendarEvent: CreateCalendarEvent) {
  await db.insert(calendarEvents).values(calendarEvent);
}