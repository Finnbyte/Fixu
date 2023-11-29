import { FastifyReply, FastifyRequest } from "fastify";
import { LoginInput } from "./session.schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { db } from "../../..";
import { users } from "../../../../db/schemas/users";
import { signJwtToken } from "../../../utils/token";

export async function GET(req: FastifyRequest) {
  return req.user.id;
}

export async function POST(req: FastifyRequest, reply: FastifyReply) {
  const { email, password } = req.body as LoginInput;

  const rows = await db.select().from(users).where(eq(users.email, email));
  if (!rows.length) {
    reply.code(401).send();
  }

  const user = rows[0];

  const hashedPassword = await bcrypt.hash(password, 10);
  console.log(hashedPassword);
  if (await bcrypt.compare(user.password, hashedPassword)) {
    reply.code(401).send();
  }

  const token = signJwtToken({ userId: user.id as string });

  reply.header("Set-Cookie", `Authorization=Bearer ${token};HttpOnly`);
  reply.code(204).send();
}

export async function DELETE(req: FastifyRequest, reply: FastifyReply) {
  reply.header("Set-Cookie", "Authorization=deleted;HttpOnly;Max-Age=-1");
  reply.code(204).send();
}
