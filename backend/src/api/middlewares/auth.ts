import { FastifyReply, FastifyRequest } from "fastify";
import { ITokenPayload, verifyJwtToken } from "../../utils/token";
import { fetchUserById } from "../modules/users/users.service";

async function getTokenPayloadFromHeader(
  req: FastifyRequest
): Promise<ITokenPayload | null> {
  try {
    const authorizationCookie = req.cookies["Authorization"] as string;

    const token = authorizationCookie.split(" ")[1];
    const tokenPayload = await verifyJwtToken(token);

    return tokenPayload;
  } catch (err) {
    return null;
  }
}

export async function isStaff(
  req: FastifyRequest,
  reply: FastifyReply,
) {
  const tokenPayload = await getTokenPayloadFromHeader(req);
  if (!tokenPayload) {
    throw reply.code(401).send({ msg: "Invalid authentication" });
  }

  const user = await fetchUserById(tokenPayload!.userId);

  const privilege = user?.privilege;
  if (privilege !== "teacher" && privilege !== "admin") {
    throw reply.code(403).send({ msg: "No authorization" });
  }

  req.user = user!;
}

export const isAuthenticated = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const tokenPayload = await getTokenPayloadFromHeader(req);
  console.log("token payload:", tokenPayload);
  if (!tokenPayload) {
    console.log("1");
    throw reply.code(401).send({ msg: "Invalid authentication" });
  }

  const user = await fetchUserById(tokenPayload!.userId);
  if (!user) {
    console.log("2");
    throw reply.code(401).send({ msg: "Invalid authentication" });
  }

  req.user = user!;
};