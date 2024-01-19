import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { Course } from "../../../backend/db/schemas/courses";
import { CalendarEvent } from "../../../backend/db/schemas/calendarEvents";

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: "/api/" }),
  tagTypes: ["EnrolledCourse", "Course", "Session", "CalendarEvent"],
  endpoints: builder => ({
    getUserData: builder.query<{ userId: string }, void>({
      query: () => "/session"
    }),
    getCourses: builder.query<Course[], void>({
      query: () => "/courses"
    }),
    getCalendarEvents: builder.query<CalendarEvent[], void>({
      query: () => "/calendar-events",
      providesTags: ["CalendarEvent"]
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
    }),
    updateCalendarEvent: builder.mutation<void, { eventId: string, payload?: CalendarEvent }>({
      query: ({ eventId, payload }) => ({
        url: `/calendar-events/${eventId}`,
        method: "PUT",
        body: payload
      })
    })
  })
})

export const { useGetCalendarEventsQuery, useGetCoursesQuery, useGetEnrolledCoursesQuery, useGetUserDataQuery, useUpdateEnrollmentStatusMutation } = apiSlice;