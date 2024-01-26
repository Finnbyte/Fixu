import { FastifyRequest } from "fastify";
import { z } from "zod";
import { createCalendarEvent, fetchCalendarEventByMonth, fetchCalendarEvents } from "./calendarEvents.service";
import { calendarEventQuery, CreateCalendarEvent } from "./calendarEvents.schema";

export async function getUsersCalendarEventsHandler(req: FastifyRequest) {
  const { year, month } = req.query as z.infer<typeof calendarEventQuery>;
  const userId = req.user.id;
  if (year && month) {
    return await fetchCalendarEventByMonth(userId, year, month)
  }

  const calendarEvents = await fetchCalendarEvents(userId);
  return calendarEvents;
}

export async function createCalendarEventHandler(req: FastifyRequest) {
  const body = req.body as CreateCalendarEvent;
  const calendarEvent = {
    title: body.title,
    type: body.type,
    date: new Date().toISOString(),
    attendee: req.user.id
  } as CreateCalendarEvent;

  await createCalendarEvent(calendarEvent);

  return;
}