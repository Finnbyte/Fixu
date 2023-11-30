import { FastifyInstance } from "fastify";
import { isAuthenticated } from "../../middlewares/auth";
import { GET, GET_WITH_PARAMS, POST } from "./courses.controller";
import { $ref } from "./courses.schema";

export default async function coursesRoute(route: FastifyInstance) {
  route.get("/", { preHandler: isAuthenticated }, GET);

  route.get(
    "/:courseId",
    {
      schema: {
        params: $ref("courseParams"),
      },
      preHandler: isAuthenticated
    },
    GET_WITH_PARAMS
  );

  route.post(
    "/",
    {
      schema: {
        body: $ref("createCourseSchema"),
      },
      preHandler: isAuthenticated
    },
    POST
  );
}