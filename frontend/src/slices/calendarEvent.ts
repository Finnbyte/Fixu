import { ActionStatus } from "./common"
import { CalendarEvent } from "../../../backend/db/schemas/calendarEvents";
import { SerializedError, createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

interface CalendarEventState {
    data: CalendarEvent[]
    status: ActionStatus;
    error: SerializedError | null;
}

export const fetchCalendarEvents = createAsyncThunk("calendarEvent/fetchCalendarEvents", async () => {
  const res = await fetch(`/api/calendar-events`, {
    credentials: "include",
  })

  if (!res.ok) {
    return null
  }

  return (await res.json());
})

export const saveCalendarEvent = createAsyncThunk("calendarEvent/saveCalendarEvent", async () => {
  const res = await fetch(`/api/calendar-events`, {
    method: "POST",
    credentials: "include",
  })

  return (await res.json()).data;
})

export const calendarEventSlice = createSlice({
  name: "calendarEvent",
  initialState: { data: [], status: "idle", error: null } as CalendarEventState,
  reducers: {
    updateEvent: (state, action: PayloadAction<CalendarEvent>) => {
      state.data = state.data.map((event) => {
        if (event.id === action.payload.id) {
          return action.payload;
        }

        return event;
      });
    },
    deleteEvent: (state, action: PayloadAction<CalendarEvent>) => {
      state.data = state.data.filter((event) => event.id !== action.payload.id);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCalendarEvents.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCalendarEvents.fulfilled, (state, action) => {
        state.status = "idle";
        state.data = action.payload;
      })
      .addCase(saveCalendarEvent.fulfilled, (state, action) => {
        state.data = [...state.data, action.payload];
      })
  },
});

export const { addEvent, deleteEvent, updateEvent } = calendarEventSlice.actions;