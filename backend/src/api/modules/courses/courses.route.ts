import { FastifyInstance } from "fastify";
import { isAuthenticated } from "../../middlewares/users";
import { GET, GET_WITH_PARAM, POST } from "./courses.controller";
import { $ref } from "./courses.schema";

export default async function coursesRoute(route: FastifyInstance) {
  route.get("/", { preHandler: isAuthenticated }, GET);

  route.get(
    "/:courseId",
    {
      schema: {
        params: $ref("courseParams"),
      },
    },
    GET_WITH_PARAM
  );

  route.post(
    "/",
    {
      schema: {
        body: $ref("createCourseSchema"),
      },
    },
    POST
  );
}