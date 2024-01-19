import { useRef, useState } from "react";
import Calendar from "../../components/Calendar/Calendar";
import { AddCircle, Delete } from "@mui/icons-material"
import styles from "./CalendarPage.module.scss";
import { format, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight } from "react-feather"
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { addCalendarEvent, deleteCalendarEvent, updateCalendarEvent } from "../../slices/calendar";
import { CalendarEvent } from "../../../../backend/db/schemas/calendarEvents";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useGetCalendarEventsQuery } from "../../slices/api";

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

function EventListingItem({ event }: { event: CalendarEvent }) {
  const dispatch = useAppDispatch();

  const titleRef = useRef<HTMLInputElement>(null);

  function handleEventTitleChange() {
    if (titleRef.current) {
      const title = titleRef.current.value;
      dispatch(updateCalendarEvent({ ...event, title }));
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
        onBlur={handleEventTitleChange}
      />
      <span onClick={() => dispatch(deleteCalendarEvent(event))}>
        <Delete />
      </span>
    </li>
  );
}

function EventsListing({ date }: { date: Date }) {
  const { selectedDateEvents } = useGetCalendarEventsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      selectedDateEvents: data?.filter(event => isSameDay(event.date, date)) ?? []
    })
  });
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.user.data!.id);

  return (
    <div className={styles["events-listing"]}>
      <div className={styles["top-row"]}>
        <span>{format(date, "MMM d, EEEE")}</span>
        <div style={{ cursor: "pointer" }} onClick={() => dispatch(addCalendarEvent(userId))}>
          <AddCircle />
        </div>
      </div>
      <ul>
        {selectedDateEvents.map((event) => (
          <EventListingItem key={event.id} event={event} />
        ))}
      </ul>
    </div>
  );
}

export default function CalendarPage() {
  const selectedDate = useAppSelector(state => state.calendar.data.selectedDate);

  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  function handleMonthChange(newMonth: number) {
    if (newMonth < 1) {
      setYear((prev) => --prev);
      setMonth(12);
    } else if (newMonth > 12) {
      setYear((prev) => ++prev);
      setMonth(1);
    } else {
      setMonth(newMonth);
    }
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
        <Calendar year={year} month={month} />
      </div>
      <EventsListing date={new Date(selectedDate)} />
    </div>
  );
}
