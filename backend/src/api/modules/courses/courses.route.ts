import { FastifyInstance } from "fastify";
import { cuidSchema } from "../../../../db/common";
import { isAuthenticated } from "../../middlewares/users";
import { GET, GET_WITH_PARAM, POST } from "./courses.controller";
import { $ref, courseQueryStringSchema } from "./courses.schema";

export default async function coursesRoute(route: FastifyInstance) {
  route.get("/", { preHandler: isAuthenticated }, GET);

  route.get(
    "/:courseId",
    {
      schema: {
        params: cuidSchema,
      },
    },
    GET_WITH_PARAM
  );

  route.get(
    "/:courseId",
    {
      schema: {
        querystring: courseQueryStringSchema,
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