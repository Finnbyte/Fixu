import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";
import { verifyJwtToken } from "../../utils/token";
import { fetchUserById } from "../modules/users/users.service";

async function getTokenPayloadFromHeader(req: FastifyRequest) {
  if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
    return null;
  }

  const token = req.headers.authorization.split(" ")[1];
  const tokenPayload = await verifyJwtToken(token);

  return tokenPayload;
}

export async function isStaff(req: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) {
  const tokenPayload = await getTokenPayloadFromHeader(req);
  if (!tokenPayload) {
    reply.code(401).send();
  }

  const user = await fetchUserById(tokenPayload!.userId);

  const privilege = user?.privilege;
  if (privilege !== "teacher" && privilege !== "admin") {
    reply.code(401).send();
  }

  req.user = user!;
  done();
}

export const isAuthenticated = async (req: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {
  const tokenPayload = await getTokenPayloadFromHeader(req);
  if (!tokenPayload) {
    reply.code(401).send();
  }

  const user = await fetchUserById(tokenPayload!.userId);
  if (!user) {
    reply.code(401).send();
  }

  req.user = user!;
  done();

};