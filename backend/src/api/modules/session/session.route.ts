import { FastifyInstance } from "fastify";
import { $ref } from "./session.schema";
import { DELETE, GET, POST } from "./session.controller";
import { isAuthenticated } from "../../middlewares/auth";

export default async function sessionRoute(route: FastifyInstance) {
  route.get("/", { preHandler: isAuthenticated }, GET);

  route.post(
    "/",
    {
      schema: {
        body: $ref("loginSchema"),
      },
    },
    POST
  );

  route.delete("/", DELETE);
}
