import { isAuthenticated, isStaff } from "../../middlewares/users";
import { FastifyInstance } from "fastify";
import { $ref } from "./users.schema";
import { GET, GET_WITH_PARAM, POST } from "./users.controller";

export default async function usersRoute(route: FastifyInstance) {
  route.get("/", { preHandler: isStaff }, GET);

  route.get(
    "/:userId",
    {
      preHandler: [isAuthenticated],
      schema: {
        params: $ref("userIdSchema"),
      },
    },
    GET_WITH_PARAM
  );

  route.post(
    "/",
    {
      schema: {
        body: $ref("registerSchema"),
      },
    },
    POST
  );
}