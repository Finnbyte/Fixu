import styles from "./Calendar.module.scss";
import { ChevronLeft, ChevronRight } from "react-feather";
import { CalendarWeek } from "./CalendarWeek";
import { getDatesInMonth, getOffsetDatesInMonth } from "../../helpers/datetime";

interface ICalendarProps {
  selectedDate: Date
  month: number
  year: number
  onScrollMonth: (newMonth: number) => void
}

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

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Calendar(props: ICalendarProps) {
  const monthDates = getDatesInMonth(props.month, props.year);
  const offsetDates = getOffsetDatesInMonth(monthDates[0]);
  const dates = [...offsetDates, ...monthDates];

  return (
    <table id={styles.calendar}>
      <tr className={styles["top-row"]}>
        <th>
          <ChevronLeft
            className={styles.chevron}
            onClick={() => props.onScrollMonth(props.month - 1)}
          />
        </th>
        <th style={{ fontSize: "1.7rem" }}>
          {months[props.month - 1]} {props.year}
        </th>
        <th>
          <ChevronRight
            className={styles.chevron}
            onClick={() => props.onScrollMonth(props.month + 1)}
          />
        </th>
      </tr>
      <tr>
        {dayLabels.map((label) => (
          <th key={label}>
            <span>{label}</span>
          </th>
        ))}
      </tr>

      {[0, 1, 2, 3, 4, 5].map((weekIdx) => {
        const weekDates = dates.slice(weekIdx * 7, ++weekIdx * 7);
        return <CalendarWeek dates={weekDates} month={props.month} />;
      })}
    </table>
  );
}

