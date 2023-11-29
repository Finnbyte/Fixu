import { createId } from "@paralleldrive/cuid2";
import { varchar } from "drizzle-orm/mysql-core";

export const CUID_LENGTH = 64;

export function cuidId() {
  return varchar("id", { length: CUID_LENGTH }).$defaultFn(() => createId());
}