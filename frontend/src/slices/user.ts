import { createAsyncThunk, createSlice, PayloadAction, SerializedError } from "@reduxjs/toolkit";
import { User } from "../../../backend/db/schemas/users";

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

interface UserState {
    data: User | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: SerializedError | null;
}

const initialState: UserState = { data: null, status: "idle", error: null };

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<User>) => {
      state.data = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUserData.pending, (state) => {
        console.log("wisdjisjdi")
        state.status = "loading";
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        console.log("x")
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        console.log("y")
        state.status = "failed";
        state.error = action.error;
      });
  },
});

export const { setUserData } = userSlice.actions;