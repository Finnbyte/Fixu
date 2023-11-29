import { buildJsonSchemas } from "fastify-zod";
import { insertUserSchema, selectUserSchema } from "../../../../db/schemas/users";
import { z } from "zod";
import { CUID_LENGTH } from "../../../../db/common";

const userIdSchema = z.string().max(CUID_LENGTH);

export type CreateUserInput = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof selectUserSchema>;

export const { schemas: usersSchemas, $ref } = buildJsonSchemas({
  insertUserSchema,
  selectUserSchema,
  userIdSchema
}, { $id: "usersSchemas" });