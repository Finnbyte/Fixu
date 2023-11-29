import { eq } from "drizzle-orm";
import { db } from "../../..";
import { users } from "../../../../db/schemas/users";
import { User } from "./users.schema";

export async function fetchUserById(userId: string): Promise<User | null> {
  const rows = await db.select().from(users).where(eq(users.id, userId));
  if (!rows.length) {
    return null;
  }

  const user = rows[0];
  return user;
}