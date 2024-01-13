import { FastifyInstance } from "fastify";
import { isAuthenticated } from "../../middlewares/auth";
import { getCoursesHandler, getCourseHandler, createCourseHandler, createCourseUserHandler, listCourseUsersHandler } from "./courses.controller";
import { $ref } from "./courses.schema";

export default async function coursesRoute(route: FastifyInstance) {
  route.get("/", { preHandler: isAuthenticated }, getCoursesHandler);

  route.get(
    "/:courseId",
    {
      schema: {
        params: $ref("courseParams"),
      },
      preHandler: isAuthenticated
    },
    getCourseHandler
  );


  route.post(
    "/",
    {
      schema: {
        body: $ref("createCourseSchema"),
      },
      preHandler: isAuthenticated
    },
    createCourseHandler
  );
}