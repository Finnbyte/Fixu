import { FastifyInstance } from "fastify";
import { $ref } from "./session.schema";
import { deleteSessionHandler, getSessionHandler, createSessionHandler } from "./session.controller";
import { isAuthenticated } from "../../middlewares/auth";

export default async function sessionRoute(route: FastifyInstance) {
  route.get("/", { preHandler: isAuthenticated }, getSessionHandler);

  route.post(
    "/",
    {
      schema: {
        body: $ref("loginSchema"),
      },
    },
    createSessionHandler
  );

  route.delete("/", deleteSessionHandler);
}
