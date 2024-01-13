import { isAuthenticated, isStaff } from "../../middlewares/auth";
import { FastifyInstance } from "fastify";
import { $ref } from "./users.schema";
import { getUsersHandler, getUserByIdHandler, createUserHandler } from "./users.controller";

export default async function usersRoute(route: FastifyInstance) {
  route.get("/", { preHandler: isStaff }, getUsersHandler);

  route.get(
    "/:userId",
    {
      preHandler: [isAuthenticated],
      schema: {
        params: $ref("userParams"),
      },
    },
    getUserByIdHandler
  );

  route.post(
    "/",
    {
      schema: {
        body: $ref("registerSchema"),
      },
    },
    createUserHandler
  );
}