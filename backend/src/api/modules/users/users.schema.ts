import { buildJsonSchemas } from "fastify-zod";
import { insertUserSchema, selectUserSchema } from "../../../../db/schemas/users";
import { z } from "zod";
import { cuidSchema } from "../../../../db/common";

/**
 * 8-length and at least one uppercase, lowercase, digit and special character.
 */
const strongPasswordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;

const registerSchema = insertUserSchema
  .omit({ id: true, privilege: true })
  .merge(
    z.object({
      email: z.string().max(78).email(),
      password: z.string().regex(strongPasswordRegex),
    })
  );

export const userIdSchema = z.object({
  userId: cuidSchema
});

export type CreateUserInput = z.infer<typeof insertUserSchema>
export type User = z.infer<typeof selectUserSchema>
export type UserParams = z.infer<typeof userIdSchema>

export const { schemas: usersSchemas, $ref } = buildJsonSchemas({
  registerSchema,
  userParams: userIdSchema,
  cuidSchema
}, { $id: "usersSchemas" });