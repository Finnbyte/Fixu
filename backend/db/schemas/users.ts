import { varchar } from "drizzle-orm/mysql-core";
import { mysqlEnum, mysqlTable } from "drizzle-orm/mysql-core";
import { cuidId } from "../common";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const userPrivileges = ["student", "teacher", "admin"] as const;

export const privilegeEnum = mysqlEnum("privilege", userPrivileges);

export const users = mysqlTable("users", {
  id: cuidId(),
  firstName: varchar("first_name", { length: 64 }).notNull(),
  lastName: varchar("last_name", { length: 64 }).notNull(),
  email: varchar("email", { length: 64 }).notNull().unique(),
  password: varchar("password", { length: 64 }).notNull(),
  privilege: privilegeEnum.notNull()
});
 
export const selectUserSchema = createSelectSchema(users);
export const insertUserSchema = createInsertSchema(users);

export type User = z.infer<typeof selectUserSchema>;
export type UserPrivilege = typeof userPrivileges[keyof typeof userPrivileges]