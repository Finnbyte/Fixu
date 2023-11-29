import { z } from "zod";

export const courseQueryStringSchema = z.object({
  name: z.string()
});

export type CourseQueryString = z.infer<typeof courseQueryStringSchema>