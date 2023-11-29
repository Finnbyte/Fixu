import { createId } from "@paralleldrive/cuid2";
import { varchar } from "drizzle-orm/mysql-core";
import { z } from "zod";

export const CUID_LENGTH = 32;

export function cuidId() {
  return varchar("id", { length: CUID_LENGTH }).$defaultFn(() => createId());
}

export const cuidSchema = z.string().max(CUID_LENGTH);