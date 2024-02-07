import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { Course } from "../../../backend/db/schemas/courses";
import { CalendarEvent } from "../../../backend/db/schemas/calendarEvents";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/" }),
  tagTypes: ["EnrolledCourse", "Course", "Session", "CalendarEvent"],
  endpoints: (builder) => ({
    getUserData: builder.query<{ userId: string }, void>({
      query: () => "/session",
    }),
    getCourses: builder.query<Course[], void>({
      query: () => "/courses",
    }),
    getCalendarEvents: builder.query<CalendarEvent[], void>({
      query: () => "/calendar-events",
      providesTags: ["CalendarEvent"],
    }),
    getEnrolledCourses: builder.query<string[], string>({
      query: (userId) => `/courses/enrollments/${userId}`,
      providesTags: ["EnrolledCourse"],
    }),
    updateEnrollmentStatus: builder.mutation<
      void,
      { status: "join" | "leave"; userId: string; courseId: string }
    >({
      query: ({ status, userId, courseId }) => ({
        url: `/courses/${courseId}/${
          status === "join" ? "enroll" : "disenroll"
        }/${userId}`,
        method: "POST",
      }),
      invalidatesTags: ["EnrolledCourse"],
    }),
    getMonthCalendarEvents: builder.query<
      CalendarEvent[],
      { year: number; month: number }
    >({
      query: ({ year, month }) => ({
        url: `/calendar-events?year=${year}&month=${month}`
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transformResponse: (data: any) => data ?? [],
      providesTags: ["CalendarEvent"]
    }),
    createCalendarEvent: builder.mutation<void, { event: CalendarEvent }>({
      query: ({ event }) => ({
        url: "/calendar-events",
        method: "POST",
        body: event,
      }),
    }),
    updateCalendarEvent: builder.mutation<
      void,
      { event: CalendarEvent }
    >({
      query: ({ event }) => ({
        url: `/calendar-events/${event.id}`,
        method: "PUT",
        body: event,
      }),
    }),
    deleteCalendarEvent: builder.mutation<
      void,
      { event: CalendarEvent }
    >({
      query: ({ event }) => ({
        url: `/calendar-events/${event.id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useGetMonthCalendarEventsQuery, useDeleteCalendarEventMutation, useCreateCalendarEventMutation, useGetCalendarEventsQuery, useUpdateCalendarEventMutation, useGetCoursesQuery, useGetEnrolledCoursesQuery, useGetUserDataQuery, useUpdateEnrollmentStatusMutation } = apiSlice;