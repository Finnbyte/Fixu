import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./slices/user";
import { calendarSlice } from "./slices/calendar";
import { apiSlice } from "./slices/api";
import { addMinutes } from "date-fns";

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    calendar: calendarSlice.reducer,
    api: apiSlice.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
});

store.subscribe(() => {
  // Persist selected date
  localStorage.setItem(
    "calendarSelectedDate",
    JSON.stringify({
      date: store.getState().calendar.data.selectedDate,
      invalidate: addMinutes(new Date(), 30),
    })
  );
});

export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
