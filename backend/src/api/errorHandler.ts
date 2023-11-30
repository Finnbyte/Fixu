import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { STATUS_CODES } from "http";
import { ZodError } from "zod";

export function customErrorHandler(error: FastifyError, req: FastifyRequest, reply: FastifyReply) {
  req.log.error(error);

  if (error instanceof ZodError) {
    reply.code(400);
    return { msg: error.issues[0].message };
  }

  reply.code(error.statusCode ?? 500);

  if (!error.statusCode) return { msg: "An unknown error occured." };

  return { msg: STATUS_CODES[error.statusCode] };

}