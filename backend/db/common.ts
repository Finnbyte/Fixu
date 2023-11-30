import { createId, isCuid } from "@paralleldrive/cuid2";
import { varchar } from "drizzle-orm/mysql-core";
import { z } from "zod";

export const MAX_CUID_LENGTH = 32;

export function cuidId() {
  return varchar("id", { length: MAX_CUID_LENGTH }).$defaultFn(() => createId()).primaryKey();
}

export const cuidSchema = z.string().refine(s => isCuid(s));