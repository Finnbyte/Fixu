import { FastifyInstance } from "fastify";
import { isAuthenticated, isStaff } from "../../middlewares/auth";
import { getCoursesHandler, getCourseHandler, createCourseHandler, createCourseUserHandler, listCourseUsersHandler, getEnrolledCoursesHandler, disenrollUserHandler, enrollUserHandler } from "./courses.controller";
import { $ref } from "./courses.schema";

export default async function coursesRoute(route: FastifyInstance) {
  route.get("/", { preHandler: isAuthenticated }, getCoursesHandler);

  route.post(
    "/",
    {
      schema: {
        body: $ref("createCourseSchema"),
      },
      preHandler: isAuthenticated,
    },
    createCourseHandler
  );

  route.get(
    "/:courseId",
    {
      schema: {
        params: $ref("courseParams"),
      },
      preHandler: isAuthenticated,
    },
    getCourseHandler
  );

  route.post(
    "/:courseId/users",
    {
      schema: {
        params: $ref("courseParams"),
        body: $ref("addStudentToCourseSchema"),
      },
      preHandler: isAuthenticated,
    },
    createCourseUserHandler
  );

  route.get(
    "/:courseId/users",
    {
      schema: {
        params: $ref("courseParams"),
      },
      preHandler: isStaff,
    },
    listCourseUsersHandler
  );

  route.get(
    "/enrollments/:userId",
    {
      schema: {
        params: $ref("userIdSchema")
      },
      preHandler: isAuthenticated
    },
    getEnrolledCoursesHandler
  );

  route.post(
    "/:courseId/enroll/:userId",
    {
      schema: {
        params: $ref("enrollUserToCourseSchema")
      },
      preHandler: isAuthenticated
    },
    enrollUserHandler
  );

}