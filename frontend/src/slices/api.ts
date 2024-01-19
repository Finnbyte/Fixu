import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { Course } from "../../../backend/db/schemas/courses";

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: "/api/" }),
  tagTypes: ["EnrolledCourse", "Course", "Session"],
  endpoints: builder => ({
    getUserData: builder.query<{ userId: string }, void>({
      query: () => "/session"
    }),
    getCourses: builder.query<Course[], void>({
      query: () => "/courses"
    }),
    getEnrolledCourses: builder.query<string[], string>({
      query: (userId) => `/courses/enrollments/${userId}`,
      providesTags: ["EnrolledCourse"]
    }),
    updateEnrollmentStatus: builder.mutation<void, { status: "join" | "leave", userId: string, courseId: string }>({
      query: ({ status, userId, courseId }) => ({
        url: `/courses/${courseId}/${status === "join" ? "enroll" : "disenroll"}/${userId}`,
        method: "POST"
      }),
      invalidatesTags: ["EnrolledCourse"]
    })
  })
})

export const { useGetCoursesQuery, useGetEnrolledCoursesQuery, useGetUserDataQuery, useUpdateEnrollmentStatusMutation } = apiSlice;