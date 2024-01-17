import { date, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { cuidId, primaryCuidIdKey } from "../common";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./users";

export const calendarEvents = mysqlTable("calendar_events", {
  id: primaryCuidIdKey(),
  attendee: cuidId("attendee_id").references(() => users.id),
  title: varchar("title", { length: 40 }).notNull(),
  date: date("date", { mode: "string" }).notNull(),
});

export const selectCalendarEventSchema = createSelectSchema(calendarEvents);
export const insertCalendarEventSchema = createInsertSchema(calendarEvents);

export type CalendarEvent = z.infer<typeof selectCalendarEventSchema>;