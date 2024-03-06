import { FastifyReply, FastifyRequest } from "fastify";
import { LoginInput } from "./session.schema";
import { signJwtToken } from "../../../utils/token";
import { fetchUserByEmail } from "../users/users.service";
import bcrypt from "bcrypt";
import { AUTHORIZATION_COOKIE } from "../../middlewares/auth";

export async function getSessionHandler(req: FastifyRequest) {
  return { userId: req.user.id };
}

export async function createSessionHandler(req: FastifyRequest, reply: FastifyReply) {
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

  reply.setCookie(AUTHORIZATION_COOKIE, `Bearer ${token}`, {
    httpOnly: true,
  });
  reply.code(204).send();
}

export async function deleteSessionHandler(req: FastifyRequest, reply: FastifyReply) {
    maxAge: -1,
  reply.cookie(AUTHORIZATION_COOKIE, "", {
    httpOnly: true
  });
  return reply.code(200).send();
}
