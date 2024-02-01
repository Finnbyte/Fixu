import { useRef } from "react";
import Calendar from "../../components/Calendar/Calendar";
import { AddCircle, Delete } from "@mui/icons-material"
import styles from "./CalendarPage.module.scss";
import { addMonths, format, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "react-feather"
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { addCalendarEvent, deleteCalendarEvent, selectEventsByDate, setSelectedDate } from "../../slices/calendar";
import { CalendarEvent } from "../../../../backend/db/schemas/calendarEvents";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useCreateCalendarEventMutation, useGetMonthCalendarEventsQuery, useUpdateCalendarEventMutation } from "../../slices/api";
import { isCuid } from "@paralleldrive/cuid2";
import { offsetDateByLocal } from "../../helpers/datetime";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

interface EventListingItemProps {
  event: CalendarEvent, 
  onDiscard: () => void 
}

function EventListingItem({ event, onDiscard }: EventListingItemProps) {
  const dispatch = useAppDispatch();
  const [createCalendarEventQuery] = useCreateCalendarEventMutation();
  const [updateCalendarEventQuery] = useUpdateCalendarEventMutation();

  const titleRef = useRef<HTMLInputElement>(null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    } else if (e.key === "Escape") {
      onDiscard();
    }
  }

  function handleInputBlur() {
    if (!titleRef.current) {
      return;
    }

    if (titleRef.current.value === "") {
      onDiscard();
      return;
    }

    const title = titleRef.current.value;
    const newEvent = { ...event, title }

    // We need to know if its updated or a new event
    const isFreshlyCreatedEvent = !isCuid(newEvent.id);
    if (isFreshlyCreatedEvent) {
      createCalendarEventQuery({ event: newEvent });
    } else {
      updateCalendarEventQuery({ event: newEvent });
    }
  }

  return (
    <li>
      <input
        type="text"
        ref={titleRef}
        defaultValue={event.title}
        onKeyDown={handleKeyDown}
        onBlur={handleInputBlur}
      />
      <span onClick={() => onDiscard()}>
        <Delete />
      </span>
    </li>
  );
}

function EventsListing({ date }: { date: Date }) {
  const events = useAppSelector(state => selectEventsByDate(state, date));
  const dispatch = useAppDispatch();

  function handleCreateNewEvent() {
    const newEvent = {
      id: crypto.randomUUID(), // Generate a random client-side id which will be overriden server-side
      date,
      title: "",
      type: "personal",
    } as unknown as CalendarEvent;
    dispatch(addCalendarEvent(newEvent));
  }

  function handleDiscardEvent(event: CalendarEvent) {
    if (event.title === "") {
      dispatch(deleteCalendarEvent(event))
    } else {
      // TODO discard from db
    }
  }

  return (
    <div className={styles["events-listing"]}>
      <div className={styles["top-row"]}>
        <span>{format(date, "MMM d, EEEE")}</span>
        <div style={{ cursor: "pointer" }} onClick={handleCreateNewEvent}>
          <AddCircle />
        </div>
      </div>
      <ul>
        {events.map((event) => (
          <EventListingItem key={event.id} event={event} onDiscard={() => handleDiscardEvent(event)} />
        ))}
      </ul>
    </div>
  );
}

export default function CalendarPage() {
  const dispatch = useAppDispatch();
  const selectedDate = new Date(useAppSelector((state) => state.calendar.data.selectedDate));

  console.log("selected", selectedDate);

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;

  // No need to assign since we only care about side effects
  // Check extraReducers in calendarSlice
  useGetMonthCalendarEventsQuery({ year, month });

  function handleMonthChange(newMonth: number) {
    // do this instead of setMonths since it doesn't account for year change
    const fn = newMonth < month ? subMonths : addMonths;
    const newSelectedDate = fn(selectedDate, 1).toISOString();
    dispatch(setSelectedDate(newSelectedDate));
  }

  return (
    <div className={styles.page}>
      <div className={styles["calendar-container"]}>
        <div className={styles["top-row"]}>
          <span>
            {months[month - 1]} {year}
          </span>
          <div style={{ display: "flex", gap: "3rem" }}>
            <ChevronLeft
              className={styles.chevron}
              onClick={() => handleMonthChange(month - 1)}
            />
            <ChevronRight
              className={styles.chevron}
              onClick={() => handleMonthChange(month + 1)}
            />
          </div>
        </div>
        <Calendar selectedDate={selectedDate} year={year} month={month} />
      </div>
      <EventsListing date={selectedDate} />
    </div>
  );
}
