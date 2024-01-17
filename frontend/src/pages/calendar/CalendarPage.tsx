import { useEffect, useState } from "react";
import Calendar from "../../components/Calendar/Calendar";
import { AddCircle, Delete } from "@mui/icons-material"
import styles from "./CalendarPage.module.scss";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "react-feather"
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { deleteCalendarEvent, fetchCalendarEvents, saveCalendarEvent, selectEventsByDate, updateCalendarEvent } from "../../slices/calendar";
import { CalendarEvent } from "../../../../backend/db/schemas/calendarEvents";
import { useAppSelector } from "../../hooks/useAppSelector";

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

function EventListingItem({ event }: { event: CalendarEvent}) {
  const dispatch = useAppDispatch();
  return (
    <li>
      <input
        type="text"
        value={event.title}
        onChange={(e) =>
          dispatch(updateCalendarEvent({ ...event, title: e.target.value }))
        }
      />
      <span onClick={() => dispatch(deleteCalendarEvent(event))}>
        <Delete />
      </span>
    </li>
  )
}

function EventsListing({ date }: { date: Date }) {
  const dispatch = useAppDispatch();
  const selectedDateEvents = useAppSelector(state => selectEventsByDate(state, date));
  return (
    <div className={styles["events-listing"]}>
      <div className={styles["top-row"]}>
        <span>{format(date, "MMM d, EEEE")}</span>
        <div style={{ cursor: "pointer" }} onClick={() => console.log("lolol")}>
          <div onClick={() => dispatch(saveCalendarEvent())}>
            <AddCircle />
          </div>
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
  const calendar = useAppSelector((state) => state.calendar);
  const dispatch = useAppDispatch();
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    dispatch(fetchCalendarEvents());
  }, []);

  if (calendar.status !== "idle") {
    return null;
  }

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
      <EventsListing date={new Date(calendar.data.selectedDate)} />
    </div>
  );
}
