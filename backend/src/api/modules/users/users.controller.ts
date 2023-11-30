import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserInput, User, UserParams } from "./users.schema";
import bcrypt from "bcrypt";
import { createUser, fetchAllUsers, fetchUserByEmail, fetchUserById } from "./users.service";
import { SALT } from "../../..";

function isAdminOrTeacher(user: User) {
  const { privilege } = user;
  return privilege === "admin" || privilege === "teacher";
}

export async function GET() {
  const users = await fetchAllUsers();
  return users;
}

export async function GET_WITH_PARAM(req: FastifyRequest, reply: FastifyReply) {
  const { userId } = req.params as UserParams;

  const user = await fetchUserById(userId);
  if (!user) {
    return reply.code(404).send();
  }

  if (user.id !== req.user?.id && !isAdminOrTeacher(user)) {
    return reply.code(401).send();
  }

  return user;
}

export async function POST(req: FastifyRequest, reply: FastifyReply) {
  const { password, ...user } = req.body as CreateUserInput;

  const isDuplicateEmail = await fetchUserByEmail(user.email) !== undefined;
  if (isDuplicateEmail) {
    return reply.code(409).send();
  }

  const hashedPassword = await bcrypt.hash(password, SALT);
  await createUser({ ...user, password: hashedPassword });
}