import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { createInitialState } from "./common";
import { Course } from "../../../backend/db/schemas/courses";

export const coursesSlice = createSlice({
  name: "courses",
  initialState: createInitialState<{
    courses: Course[];
    enrolledCourses: string[];
  }>({ courses: [], enrolledCourses: [] }),
  reducers: {
    setEnrolledCourses: (state, action: PayloadAction<string[]>) => {
      state.data.enrolledCourses = action.payload;
    },
    setCourses: (state, action: PayloadAction<Course[]>) => {
      state.data.courses = action.payload;
    },
  },
});