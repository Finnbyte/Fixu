import { createId, isCuid } from "@paralleldrive/cuid2";
import { varchar } from "drizzle-orm/mysql-core";
import { z } from "zod";

export const MAX_CUID_LENGTH = 32;

export function primaryCuidIdKey() {
  return varchar("id", { length: MAX_CUID_LENGTH }).$defaultFn(() => createId()).primaryKey();
}

export function cuidId(name: string) {
  return varchar(name, { length: MAX_CUID_LENGTH });
}

export const cuidSchema = z.string().refine(s => isCuid(s));