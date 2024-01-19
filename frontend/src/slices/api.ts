import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: 'api',
  // All of our requests will have URLs starting with '/fakeApi'
  baseQuery: fetchBaseQuery({ baseUrl: "/api/" }),
  // The "endpoints" represent operations and requests for this server
  endpoints: builder => ({
    // The `getPosts` endpoint is a "query" operation that returns data
    getCourses: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: () => '/courses'
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