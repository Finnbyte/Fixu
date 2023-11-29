import { eq, sql } from "drizzle-orm";
import { FastifyReply, FastifyRequest } from "fastify";
import { db } from "../../..";
import { users } from "../../../../db/schemas/users";
import { CreateUserInput, User } from "./users.schema";
import bcrypt from "bcrypt";

function isAdminOrTeacher(user: User) {
  const { privilege } = user;
  return privilege === "admin" || privilege === "teacher";
}

export async function GET() {
  return await db.select().from(users);
}

export async function GET_WITH_PARAM(req: FastifyRequest, reply: FastifyReply) {
  const userId = req.params as string;

  const rows = await db.select().from(users).where(eq(users.id, userId));
  if (!rows.length) {
    reply.code(404).send();
  }

  const user = rows[0];
  if (user.id !== req.user?.id && !isAdminOrTeacher(user)) {
    reply.code(401).send();
  }

  return user;
}

export async function POST(req: FastifyRequest, reply: FastifyReply) {
  const { password, ...user } = req.body as CreateUserInput;

  const isDuplicateEmail = await db.execute(
    sql`SELECT COUNT(email) FROM ${users} WHERE ${users.email} = ${user.email}`
  );
  if (isDuplicateEmail) {
    reply.code(409).send();
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.insert(users).values({ ...user, password: hashedPassword });
}
