import { ActionStatus } from "./common"
import { CalendarEvent } from "../../../backend/db/schemas/calendarEvents";
import { SerializedError, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isSameDay } from "date-fns";
import cuid2 from "@paralleldrive/cuid2";

interface CalendarStateData {
  events: CalendarEvent[]
  selectedDate: string
}

interface CalendarEventState {
    data: CalendarStateData
    status: ActionStatus;
    error: SerializedError | null;
}

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
    addCalendarEventForUser: (state, action: PayloadAction<string>) => {
      const attendeeId = action.payload;
      const event: CalendarEvent = {
        id: cuid2.createId(),
        date: state.data.selectedDate,
        title: "",
        attendee: attendeeId
      }
      state.data.events = [...state.data.events, event]
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
});

export const {setSelectedDate, addCalendarEventForUser: addCalendarEvent, deleteCalendarEvent, updateCalendarEvent } = calendarSlice.actions;
export const { isDateEventful, selectEventsByDate } = calendarSlice.selectors;