import { FastifyRequest } from "fastify";
import { db } from "../../..";
import { courses } from "../../../../db/schemas/courses";
import { eq, sql } from "drizzle-orm";
import { CourseQueryString } from "./courses.schema";

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