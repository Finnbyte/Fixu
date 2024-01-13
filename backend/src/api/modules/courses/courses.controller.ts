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
export async function listCourseUsersHandler(req: FastifyRequest) {
  const { courseId } =  req.params as CourseParams;
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