import { FastifyRequest } from "fastify";
import { createCalendarEvent, fetchCalendarEvents } from "./calendarEvents.service";
import { CreateCalendarEvent } from "./calendarEvents.schema";

export async function getUsersCalendarEventsHandler(req: FastifyRequest) {
  const calendarEvents = await fetchCalendarEvents(req.user.id);
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