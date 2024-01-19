import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./slices/user";
import { calendarSlice } from "./slices/calendar";
import { apiSlice } from "./slices/api";

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    calendar: calendarSlice.reducer,
    api: apiSlice.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
