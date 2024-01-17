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
