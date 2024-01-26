import { useEffect, useRef, useState } from "react";
import Calendar from "../../components/Calendar/Calendar";
import { AddCircle, Delete } from "@mui/icons-material"
import styles from "./CalendarPage.module.scss";
import { addMonths, format, isSameDay, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "react-feather"
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { deleteCalendarEvent, selectEventsByDate, setSelectedDate, updateCalendarEvent } from "../../slices/calendar";
import { CalendarEvent } from "../../../../backend/db/schemas/calendarEvents";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useGetMonthCalendarEventsQuery } from "../../slices/api";

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

function EventListingItem({ event, onDiscard }: { event: CalendarEvent, onDiscard: () => void }) {
  const dispatch = useAppDispatch();

  const titleRef = useRef<HTMLInputElement>(null);

  function handleEventTitleChange() {
    if (titleRef.current) {
      const title = titleRef.current.value;
      dispatch(updateCalendarEvent({ ...event, title }));
    }
  }

  function handleInputBlur() {
    if (!titleRef.current) {
      return
    }

    if (titleRef.current.value === "") {
      onDiscard()
      return
    }
  }

  return (
    <li>
      <input
        autoFocus
        type="text"
        ref={titleRef}
        defaultValue={event.title}
        onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
        onBlur={handleInputBlur}
      />
      <span onClick={() => onDiscard()}>
        <Delete />
      </span>
    </li>
  );
}

function EventsListing({
  events,
  date,
}: {
  events: CalendarEvent[];
  date: Date;
}) {
  const [selectedDateEvents, setSelectedDateEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    setSelectedDateEvents(events.filter((e) => isSameDay(e.date, date)));
  }, [events]);

  function handleCreateNewEvent() {
    const newEvent = {
      id: crypto.randomUUID(),
      title: "",
      type: "personal",
    } as CalendarEvent;
    setSelectedDateEvents((prev) => [...prev, newEvent]);
  }

  function handleDiscardEvent(event: CalendarEvent) {
    if (event.title === "") {
      setSelectedDateEvents(prev => prev.filter(e => e.id !== event.id));
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
        {selectedDateEvents.map((event) => (
          <EventListingItem key={event.id} event={event} onDiscard={() => handleDiscardEvent(event)} />
        ))}
      </ul>
    </div>
  );
}

export default function CalendarPage() {
  const dispatch = useAppDispatch();
  const selectedDate = useAppSelector(state => state.calendar.data.selectedDate);

  const year = new Date(selectedDate).getFullYear();
  const month = new Date(selectedDate).getMonth() + 1;

  const { data: currentMonthEvents } = useGetMonthCalendarEventsQuery({ year, month });

  if (!currentMonthEvents) {
    return null;
  }

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
            <ChevronLeft className={styles.chevron} onClick={() => handleMonthChange(month - 1)} />
            <ChevronRight className={styles.chevron} onClick={() => handleMonthChange(month + 1)} />
          </div>
        </div>
        <Calendar events={[...currentMonthEvents]} year={year} month={month} />
      </div>
      <EventsListing events={[...currentMonthEvents]} date={new Date(selectedDate)} />
    </div>
  );
}
