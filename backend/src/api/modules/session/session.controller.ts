import { FastifyReply, FastifyRequest } from "fastify";
import { LoginInput } from "./session.schema";
import { signJwtToken } from "../../../utils/token";
import { fetchUserByEmail } from "../users/users.service";
import bcrypt from "bcrypt";

export async function GET(req: FastifyRequest) {
  return req.user.id;
}

export async function POST(req: FastifyRequest, reply: FastifyReply) {
  const { email, password } = req.body as LoginInput;

  const user = await fetchUserByEmail(email);
  if (!user) {
    reply.code(401);
    return { msg: "Incorrect credentials" };
  }

  const isCorrectPassword = await bcrypt.compare(password, user.password);
  if (!isCorrectPassword) {
    reply.code(401);
    return { msg: "Incorrect credentials" };
  }

  const token = signJwtToken({ userId: user.id as string });

  reply.cookie("Authorization", `Bearer ${token}`, {
    httpOnly: true,
  });
  reply.code(204).send();
}

export async function DELETE(req: FastifyRequest, reply: FastifyReply) {
  reply.clearCookie("Authorization", {
    httpOnly: true
  });
  reply.code(204).send();
}
