import { eq } from "drizzle-orm";
import { db } from "../../..";
import { users } from "../../../../db/schemas/users";
import { CreateUserInput, User } from "./users.schema";

export async function fetchAllUsers() {
  return await db.select().from(users);
}

export async function fetchUserById(userId: string): Promise<User | undefined> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId)
  });

  return user;
}

export async function fetchUserByEmail(email: string): Promise<User | undefined> {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email)
  });

  return user;
}

export async function createUser(user: CreateUserInput) {
  await db.insert(users).values(user);
}