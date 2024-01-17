import { FastifyReply, FastifyRequest } from "fastify";
import { CreateCourseUser, CourseParams, CreateCourseInput, courseQueryStringSchema } from "./courses.schema";
import { createCourse, createCourseUser, fetchAllCourses, fetchCourseById, fetchCourseByName, fetchCourseUsers, fetchEnrolledCourses } from "./courses.service";
import { z } from "zod";
import { userIdSchema } from "../users/users.schema";
import { isSpeciallyPrivileged } from "../../../utils/user";

export async function getCoursesHandler(req: FastifyRequest) {
  const result = courseQueryStringSchema.safeParse(req.query);
  const isSearchingByName = result.success;
  if (isSearchingByName) {
    const courseName = result.data.name;

    const course = await fetchCourseByName(courseName);
    return course;
  }

  const courses = await fetchAllCourses();
  return courses;
}

export async function getCourseHandler(req: FastifyRequest) {
  const { courseId } = req.params as CourseParams;

  const course = await fetchCourseById(courseId);
  return course;
}

export async function createCourseUserHandler(req: FastifyRequest, reply: FastifyReply) {
  const { courseId } = req.params as CourseParams;
  const { userId, isTeacher } = req.body as CreateCourseUser;
  
  const user = req.user;
  const hasTeacherPerms = user.privilege === "admin" || user.privilege === "teacher";

  if ((isTeacher && user.id !== userId) && !hasTeacherPerms) {
    reply.code(401);
    return { msg: "No authorization to add other users into course" };
  }

  await createCourseUser(courseId, userId, isTeacher);
  return reply.code(200).send();
}

export async function listCourseUsersHandler(req: FastifyRequest) {
  const { courseId } =  req.params as CourseParams;
  const courseUsers = await fetchCourseUsers(courseId);
  console.log(courseUsers);

  return courseUsers;
}

export async function createCourseHandler(req: FastifyRequest, reply: FastifyReply) {
  const { name, description } = req.body as CreateCourseInput;

  const isUniqueCourse = await fetchCourseByName(name) === undefined;
  if (!isUniqueCourse) {
    reply.code(409);
    return { msg: "Course with same name already exists" };
  }

  const creationTime = new Date();

  await createCourse({ name, description, createdAt: creationTime });
  return reply.code(200).send();
}

export async function getEnrolledCoursesHandler(req: FastifyRequest, reply: FastifyReply) {
  const userId = (req.params as z.infer<typeof userIdSchema>).userId;

  if (!isSpeciallyPrivileged(req.user) && userId !== req.user.id) {
    return reply.code(401).send({ msg: "No authorization to see other user's enrolled courses" });
  }

  return await fetchEnrolledCourses(userId);
}