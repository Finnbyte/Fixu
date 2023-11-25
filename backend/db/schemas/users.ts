import { varchar } from "drizzle-orm/mysql-core";
import { mysqlEnum, mysqlTable } from "drizzle-orm/mysql-core";
import { cuidId } from "../types";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const privilegeEnum = mysqlEnum("privilege", ["student", "teacher", "admin"]);

export const users = mysqlTable("users", {
  id: cuidId(),
  firstName: varchar("first_name", { length: 64 }).notNull(),
  lastName: varchar("last_name", { length: 64 }).notNull(),
  email: varchar("email", { length: 64 }).notNull(),
  password: varchar("password", { length: 64 }).notNull(),
  privilege: privilegeEnum.notNull()
});
 
export const selectUserSchema = createSelectSchema(users);
export const insertUserSchema = createInsertSchema(users);