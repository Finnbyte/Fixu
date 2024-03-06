import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../../backend/db/schemas/users";
import { createInitialState } from "./common";

export const fetchUserData = createAsyncThunk("user/fetchUserData", async (userId: string) => {
  const res = await fetch(`/api/users/${userId}`, {
    credentials: "include",
  })

  if (!res.ok) {
    return null
  }

  const data = await res.json() as User;
  return data
})

export const userSlice = createSlice({
  name: "user",
  initialState: createInitialState<User>([]),
  reducers: {
    setUserData: (state, action: PayloadAction<User>) => {
      state.data = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUserData.pending, (state) => {
        console.log("user data fetch pending")
        state.status = "loading";
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        console.log("user data fetch fulfilled")
        state.status = "succeeded";
        state.data = action.payload!;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        console.log("user data fetch rejected")
        state.status = "failed";
        state.error = action.error;
      });
  },
});

export const { setUserData } = userSlice.actions;