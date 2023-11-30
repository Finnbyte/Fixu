import { FastifyReply, FastifyRequest } from "fastify";
import { db } from "../../..";
import { courses } from "../../../../db/schemas/courses";
import { eq } from "drizzle-orm";
import { CreateCourseInput, courseQueryStringSchema } from "./courses.schema";

export async function GET(req: FastifyRequest) {
  const queryStringParseResult = courseQueryStringSchema.safeParse(req.query);
  if (!queryStringParseResult.success) {
    return await db.select().from(courses);
  }

  const courseName = queryStringParseResult.data.name;
  return await db.query.courses.findFirst({
    where: eq(courses.name, courseName)
  });
}

export async function GET_WITH_PARAM(req: FastifyRequest) {
  const { courseId } = req.params as { courseId: string };
  return await db.select().from(courses).where(eq(courses.id, courseId));
}

export async function POST(req: FastifyRequest, reply: FastifyReply) {
  const { name, description } = req.body as CreateCourseInput;
  const creationTime = new Date();

  const isUniqueCourse = await db.query.courses.findFirst({ where: eq(courses.name, name)}) === undefined;
  if (!isUniqueCourse) {
    reply.code(409);
    return { msg: "Course with same name already exists" };
  }

  await db.insert(courses).values({ name, description, createdAt: creationTime });
  return reply.code(200).send();
}