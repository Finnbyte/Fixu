import { FastifyReply, FastifyRequest } from "fastify";
import { db } from "../../..";
import { courses } from "../../../../db/schemas/courses";
import { eq, sql } from "drizzle-orm";
import { CourseQueryString, CreateCourseInput } from "./courses.schema";

export async function GET() {
  return await db.select().from(courses);
}

export async function GET_WITH_PARAM(req: FastifyRequest) {
  const { courseId } = req.params as { courseId: string };
  return await db.select().from(courses).where(eq(courses.id, courseId));
}

export async function GET_WITH_QUERYSTRING(req: FastifyRequest) {
  const { name } = req.query as CourseQueryString;
  return await db
    .select()
    .from(courses)
    .where(sql`${courses.name} LIKE ${name}`);
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