import { createInitialState } from "./common"
import { CalendarEvent } from "../../../backend/db/schemas/calendarEvents";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isPast, isSameDay } from "date-fns";
import { apiSlice } from "./api";

function getInitialSelectedDate() {
  const isDateCached = localStorage.getItem("calendarSelectedDate")
  if (!isDateCached) {
    return new Date().toISOString();
  }

  const dateCache = JSON.parse(localStorage.getItem("calendarSelectedDate")!);
  if (isPast(dateCache.invalidate)) {
    return new Date().toISOString();
  }
  
  return dateCache.date;
}

export const calendarSlice = createSlice({
  name: "calendar",
  initialState: createInitialState<{
    events: CalendarEvent[];
    selectedDate: string;
  }>({ events: [], selectedDate: getInitialSelectedDate() }),
  selectors: {
    selectEventsByDate(state, date: Date) {
      return state.data.events.filter((event) =>
        isSameDay(new Date(event.date), date)
      );
    },
  },
  reducers: {
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.data.selectedDate = action.payload;
    },
    addCalendarEventForUser: (state, action: PayloadAction<CalendarEvent>) => {
      state.data.events.push(action.payload);
    },
    updateCalendarEvent: (state, action: PayloadAction<CalendarEvent>) => {
      for (const [i, event] of state.data.events.entries()) {
        if (event.id === action.payload.id) {
          state.data.events[i] = action.payload;
          return;
        }
      }
    },
    deleteCalendarEvent: (state, action: PayloadAction<CalendarEvent>) => {
      for (const [i, event] of state.data.events.entries()) {
        if (event.id === action.payload.id) {
          state.data.events.splice(i, 1);
          return;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      apiSlice.endpoints.getMonthCalendarEvents.matchFulfilled,
      (state, { payload }) => {
        state.data.events = payload;
      }
    );
  },
});

export const {setSelectedDate, addCalendarEventForUser: addCalendarEvent, deleteCalendarEvent, updateCalendarEvent } = calendarSlice.actions;
export const { selectEventsByDate } = calendarSlice.selectors;