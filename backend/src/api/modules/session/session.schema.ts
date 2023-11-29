import { buildJsonSchemas } from "fastify-zod";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string(),
  password: z.string()
});

export type LoginInput = z.infer<typeof loginSchema>;

export const { schemas: sessionSchemas, $ref } = buildJsonSchemas({
  loginSchema,
}, { $id: "sessionSchemas" });