import { z } from "zod";
import { insertCalendarEventSchema } from "../../../../db/schemas/calendarEvents";
import { buildJsonSchemas } from "fastify-zod";

export const createCalendarEventSchema = insertCalendarEventSchema.omit({ id: true });
export const createCalendarEventBodySchema = insertCalendarEventSchema.omit({ id: true, attendee: true });

export type CreateCalendarEvent = z.infer<typeof createCalendarEventSchema>
export type CreateCalendarEventBody = z.infer<typeof createCalendarEventBodySchema>

export const { schemas: calendarEventsSchemas, $ref } = buildJsonSchemas({
  createCalendarEventSchema,
  createCalendarEventBodySchema
}, { $id: "calendarEventsSchemas" });