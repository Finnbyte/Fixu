import { boolean, date, mysqlTable, text, varchar } from "drizzle-orm/mysql-core";
import { MAX_CUID_LENGTH, cuidId } from "../common";
import { users } from "./users";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const courses = mysqlTable("courses", {
  id: cuidId(),
  name: varchar("name", { length: 62 }).unique().notNull(),
  description: text("description").notNull(),
  createdAt: date("created_at").notNull(),
  endedAt: date("ended_at")
});

export const usersCourses = mysqlTable("users_courses", {
  id: cuidId(),
  userId: varchar("user_id", { length: MAX_CUID_LENGTH }).references(() => users.id),
  courseId: varchar("course_id", { length: MAX_CUID_LENGTH }).references(() => courses.id),
  isTeaching: boolean("is_teaching")
});

export const selectCourseSchema = createSelectSchema(courses);
export const insertCourseSchema = createInsertSchema(courses);

export type Course = z.infer<typeof selectCourseSchema>;