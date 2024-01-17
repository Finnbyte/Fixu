import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./slices/user";
import { calendarSlice } from "./slices/calendar";

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    calendar: calendarSlice.reducer
  }
});

export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
