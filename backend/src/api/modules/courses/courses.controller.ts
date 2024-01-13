import { FastifyReply, FastifyRequest } from "fastify";
import { CreateCourseUser, CourseParams, CreateCourseInput, courseQueryStringSchema } from "./courses.schema";
import { createCourse, createCourseUser, fetchAllCourses, fetchCourseById, fetchCourseByName, fetchCourseUsers } from "./courses.service";

export async function getCoursesHandler(req: FastifyRequest) {
  const queryStringParseResult = courseQueryStringSchema.safeParse(req.query);
  if (!queryStringParseResult.success) {
    const courses = await fetchAllCourses();
    return courses;
  }

  const courseName = queryStringParseResult.data.name;

  const course = await fetchCourseByName(courseName);
  return course;
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
  const creationTime = new Date();

  const isUniqueCourse = await fetchCourseByName(name) === undefined;
  if (!isUniqueCourse) {
    reply.code(409);
    return { msg: "Course with same name already exists" };
  }

  await createCourse({ name, description, createdAt: creationTime });
  return reply.code(200).send();
}