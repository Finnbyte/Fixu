import { date, mysqlEnum, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { cuidId, primaryCuidIdKey } from "../common";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./users";
import { courses } from "./courses";

const calendarEventTypes = ["personal", "course"] as const;

export const calendarEvents = mysqlTable("calendar_events", {
  id: primaryCuidIdKey(),
  type: mysqlEnum("type", calendarEventTypes).notNull(),
  courseId: cuidId("course_id").references(() => courses.id),
  authorId: cuidId("author_id").references(() => users.id),
  title: varchar("title", { length: 40 }).notNull(),
  date: date("date", { mode: "date" }).notNull(),
});

export const selectCalendarEventSchema = createSelectSchema(calendarEvents);
export const insertCalendarEventSchema = createInsertSchema(calendarEvents);

export type CalendarEvent = z.infer<typeof selectCalendarEventSchema>;
export type CalendarEventType = typeof calendarEventTypes[keyof typeof calendarEventTypes];