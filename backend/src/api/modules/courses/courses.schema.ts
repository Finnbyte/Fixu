import { z } from "zod";
import { insertCourseSchema } from "../../../../db/schemas/courses";
import { buildJsonSchemas } from "fastify-zod";
import { cuidSchema } from "../../../../db/common";
import { userIdSchema } from "../users/users.schema";

export const courseQueryStringSchema = z.object({
  name: z.string()
});

export const createCourseSchema = insertCourseSchema.omit({ id: true, createdAt: true, endedAt: true });

export const courseParams = z.object({
  courseId: cuidSchema
});

export const enrollUserToCourseSchema = z.object({
  courseId: cuidSchema,
  userId: cuidSchema
});

export const createCourseUserSchema = z.object({
  userId: cuidSchema,
  isTeacher: z.boolean()
});

export const { schemas: coursesSchemas, $ref } = buildJsonSchemas({
  userIdSchema,
  createCourseSchema,
  enrollUserToCourseSchema,
  addStudentToCourseSchema: createCourseUserSchema,
  courseParams,
}, { $id: "coursesSchemas" });

export type CourseQueryString = z.infer<typeof courseQueryStringSchema>
export type CourseParams = z.infer<typeof courseParams>
export type CreateCourseInput = z.infer<typeof createCourseSchema>
export type CreateCourseFull = z.infer<typeof insertCourseSchema>
export type CreateCourseUser = z.infer<typeof createCourseUserSchema>