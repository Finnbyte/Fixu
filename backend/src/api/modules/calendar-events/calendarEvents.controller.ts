import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { createCalendarEvent, deleteCalendarEvent, fetchCalendarEventByMonth, fetchCalendarEvents, updateCalendarEvent } from "./calendarEvents.service";
import { calendarEventParams, calendarEventQuery, CreateCalendarEvent } from "./calendarEvents.schema";
import { CalendarEvent } from "../../../../db/schemas/calendarEvents";

export async function getUsersCalendarEventsHandler(req: FastifyRequest) {
  const { year, month } = req.query as z.infer<typeof calendarEventQuery>;
  const userId = req.user.id;
  if (year && month) {
    return await fetchCalendarEventByMonth(userId, year, month);
  }

  const calendarEvents = await fetchCalendarEvents(userId);
  return calendarEvents;
}

export async function createCalendarEventHandler(req: FastifyRequest) {
  const body = req.body as CreateCalendarEvent;
  const calendarEvent = {
    title: body.title,
    type: body.type,
    date: new Date(body.date),
    authorId: req.user.id
  } as CreateCalendarEvent;

  await createCalendarEvent(calendarEvent);

  return;
}

export async function updateCalendarEventHandler(req: FastifyRequest, reply: FastifyReply) {
  const calendarEvent = req.body as CalendarEvent;

  await updateCalendarEvent(calendarEvent);
  return reply.code(200).send();
}

export async function deleteCalendarEventHandler(req: FastifyRequest, reply: FastifyReply) {
  const { calendarEventId } = req.params as z.infer<typeof calendarEventParams>;

  await deleteCalendarEvent(calendarEventId);
  return reply.code(200).send();
}