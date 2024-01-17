import { eq, and } from "drizzle-orm";
import { db } from "../../..";
import { courses, usersCourses } from "../../../../db/schemas/courses";
import { CreateCourseFull } from "./courses.schema";
import { users } from "../../../../db/schemas/users";

export async function fetchAllCourses() {
  return await db.select().from(courses);
}

export async function fetchCourseByName(courseName: string) {
  const course = await db.query.courses.findFirst({
    where: eq(courses.name, courseName),
  });

  return course;
}

export async function fetchCourseById(courseId: string) {
  const course = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
  });

  return course;
}

export async function fetchCourseUsers(courseId: string, filterPrivilege?: "student" | "teacher") {
  const showOnlyTeachers = filterPrivilege === "teacher";

  const result = await db
    .select()
    .from(usersCourses)
    .where(
      and(
        eq(usersCourses.courseId, courseId),
        filterPrivilege && eq(usersCourses.isTeaching, showOnlyTeachers)
      )
    )
    .leftJoin(users, eq(users.id, usersCourses.userId));

  return result.map((element) => element.users);
}

export async function createCourseUser(courseId: string, userId: string, isTeaching: boolean) {
  await db.insert(usersCourses).values({ courseId, userId, isTeaching });
}

export async function createCourse(course: CreateCourseFull) {
  await db.insert(courses).values(course);
}

export async function fetchEnrolledCourses(userId: string) {
  return await db
    .select()
    .from(usersCourses)
    .where(eq(usersCourses.userId, userId))
    .leftJoin(courses, eq(courses.id, usersCourses.courseId));
}