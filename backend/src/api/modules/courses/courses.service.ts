import { eq } from "drizzle-orm";
import { db } from "../../..";
import { courses } from "../../../../db/schemas/courses";
import { CreateCourseFull } from "./courses.schema";

export async function fetchAllCourses() {
  return await db.select().from(courses);
}

export async function fetchCourseByName(courseName: string) {
  const course = await db.query.courses.findMany({
    where: eq(courses.name, courseName),
  });

  return course;
}

export async function fetchCourseById(courseId: string) {
  const course = await db.query.courses.findMany({
    where: eq(courses.id, courseId),
  });

  return course;
}

export async function createCourse(course: CreateCourseFull) {
  await db.insert(courses).values(course);
}