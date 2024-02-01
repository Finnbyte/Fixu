import { z } from "zod";
import { insertCalendarEventSchema } from "../../../../db/schemas/calendarEvents";
import { buildJsonSchemas } from "fastify-zod";
import { cuidSchema } from "../../../../db/common";

export const createCalendarEventSchema = insertCalendarEventSchema.omit({ id: true });
export const createCalendarEventBodySchema = insertCalendarEventSchema.omit({ id: true, attendee: true });

export const updateCalendarEventSchema = z.object

export const calendarEventQuery = z.object({
  year: z.number().optional(),
  month: z.number().optional(),
})

export const calendarEventParams = z.object({
  calendarEventId: cuidSchema
})

export type CreateCalendarEvent = z.infer<typeof createCalendarEventSchema>
export type CreateCalendarEventBody = z.infer<typeof createCalendarEventBodySchema>

export const { schemas: calendarEventsSchemas, $ref } = buildJsonSchemas({
  calendarEventQuery,
  calendarEventParams,
  createCalendarEventSchema,
  createCalendarEventBodySchema
}, { $id: "calendarEventsSchemas" });