import { z } from "zod";
import { insertCourseSchema } from "../../../../db/schemas/courses";
import { buildJsonSchemas } from "fastify-zod";
import { cuidSchema } from "../../../../db/common";

export const courseQueryStringSchema = z.object({
  name: z.string()
});

export const createCourseSchema = insertCourseSchema.omit({ id: true, createdAt: true, endedAt: true });

export const courseParams = z.object({
  courseId: cuidSchema
});

export const { schemas: coursesSchemas, $ref } = buildJsonSchemas({
  createCourseSchema,
  courseParams
});

export type CourseQueryString = z.infer<typeof courseQueryStringSchema>
export type CreateCourseInput = z.infer<typeof createCourseSchema>