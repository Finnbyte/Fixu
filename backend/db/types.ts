import { createId } from "@paralleldrive/cuid2";
import { varchar } from "drizzle-orm/mysql-core";

export function cuidId() {
  return varchar("id", { length: 128 }).$defaultFn(() => createId());
}