import { useState } from "react";
import Calendar from "../../components/Calendar/Calendar";
import { ArrowLeft, ArrowRight, AddCircle } from "@mui/icons-material"
import styles from "./CalendarPage.module.scss";
import { format } from "date-fns";

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

interface IEvent {
  id: number;
  title: string;
}

function EventsListing({
  date,
  events,
  onEventChange,
}: {
  date: Date;
  events: IEvent[];
  onEventChange: (event: IEvent) => void;
}) {
  return (
    <div className={styles["events-listing"]}>
      <div className={styles["top-row"]}>
        <span>{format(date, "MMM d, EEEE")}</span>
        <div style={{ cursor: "pointer" }} onClick={() => console.log("lolol")}>
          <AddCircle />
        </div>
      </div>
      <ul>
        {events.map((event) => {
          return (
            <li key={event.id}>
              <input
                type="text"
                value={event.title}
                onChange={(e) =>
                  onEventChange({ ...event, title: e.target.value })
                }
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function CalendarPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState([{ id: 1, title: "Feed cats" }, { id: 2, title: "Eat popcorn" }, { id: 3, title: "Take shower" }]);

  function handleDateSelect(date: Date) {
    setSelectedDate(date);
  }

  function handleEventChange(event: IEvent) {
    setEvents(prev => prev.map(e => {
      if (e.id === event.id) {
        return { ...e, ...event };
      }

      return e;
    }))
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
          <div>
            <button onClick={() => handleMonthChange(month - 1)}>
              <ArrowLeft />
            </button>
            <button onClick={() => handleMonthChange(month + 1)}>
              <ArrowRight />
            </button>
          </div>
        </div>
        <Calendar year={year} month={month} onDateClick={handleDateSelect} />
      </div>
      <EventsListing date={selectedDate} events={events} onEventChange={handleEventChange} />
    </div>
  );
}
