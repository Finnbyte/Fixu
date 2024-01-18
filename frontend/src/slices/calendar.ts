import { ActionStatus } from "./common"
import { CalendarEvent } from "../../../backend/db/schemas/calendarEvents";
import { SerializedError, createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { isSameDay } from "date-fns";

interface CalendarStateData {
  events: CalendarEvent[]
  selectedDate: string
}

interface CalendarEventState {
    data: CalendarStateData
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

export const calendarSlice = createSlice({
  name: "calendar",
  initialState: {
    data: { events: [], selectedDate: new Date().toISOString() },
    status: "idle",
    error: null,
  } as CalendarEventState,
  selectors: {
    selectEventsByDate(state, date: Date) {
      return state.data.events.filter(event => isSameDay(event.date, date));
    },
    isDateEventful(state, date: Date) {
      return state.data.events.some(event => isSameDay(event.date, date))
    }
  },
  reducers: {
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.data.selectedDate = action.payload;
    },
    updateCalendarEvent: (state, action: PayloadAction<CalendarEvent>) => {
      state.data.events = state.data.events.map((event) => {
        if (event.id === action.payload.id) {
          return action.payload;
        }

        return event;
      });
    },
    deleteCalendarEvent: (state, action: PayloadAction<CalendarEvent>) => {
      state.data.events = state.data.events.filter((event) => event.id !== action.payload.id);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCalendarEvents.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCalendarEvents.fulfilled, (state, action) => {
        state.status = "idle";
        state.data.events = action.payload;
      })
      .addCase(saveCalendarEvent.fulfilled, (state, action) => {
        state.data.events = [...state.data.events, action.payload];
      });
  },
});

export const {setSelectedDate, deleteCalendarEvent, updateCalendarEvent } = calendarSlice.actions;
export const { isDateEventful, selectEventsByDate } = calendarSlice.selectors;