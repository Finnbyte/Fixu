import { z } from "zod";
import { insertCourseSchema } from "../../../../db/schemas/courses";
import { buildJsonSchemas } from "fastify-zod";

export const courseQueryStringSchema = z.object({
  name: z.string()
});

export const createCourseSchema = insertCourseSchema.omit({ id: true, createdAt: true, endedAt: true });

export const { schemas: coursesSchemas, $ref } = buildJsonSchemas({
  createCourseSchema
});

export type CourseQueryString = z.infer<typeof courseQueryStringSchema>
export type CreateCourseInput = z.infer<typeof createCourseSchema>