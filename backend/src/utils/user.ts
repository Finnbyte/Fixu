import { User } from "../../db/schemas/users";

export function isTeacher(user: User) {
  return user.privilege === "teacher";
}

export function isAdmin(user: User) {
  return user.privilege === "admin";
}

export function isSpeciallyPrivileged(user: User) {
  return user.privilege === "teacher" || user.privilege === "admin";
}
