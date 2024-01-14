import { eachDayOfInterval, endOfMonth, isToday, startOfMonth, subDays } from "date-fns";
import styles from "./Calendar.module.scss";

function getDatesInMonth(month: number, year: number): Date[] {
  const start = startOfMonth(new Date(year, month - 1, 15));
  const end = endOfMonth(start);

  return eachDayOfInterval({ start, end });
}

function getOffsetDatesInMonth(firstDateOfMonth: Date) {
  const offsetAmount = firstDateOfMonth.getDay() - 1;
  return Array.from({ length: offsetAmount }).map((_, i) =>
    subDays(firstDateOfMonth, offsetAmount - i)
  );
}

interface ICalendarProps {
  month: number
  year: number
  onDateClick: (date: Date) => void
}

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Calendar(props: ICalendarProps) {
  const dates = getDatesInMonth(props.month, props.year);
  const offsetDates = getOffsetDatesInMonth(dates[0]);
  return (
    <table id={styles.table}>
      <thead>
        <tr>
          {dayLabels.map((label) => (
            <th key={label}>
              <span>{label}</span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <CalendarDays dates={[...offsetDates, ...dates]} primaryMonth={props.month} onDateClick={(date) => props.onDateClick(date)} />
      </tbody>
    </table>
  );
}

interface ICalendarDaysProps {
    dates: Date[];
    primaryMonth: number;
    onDateClick: (date: Date) => void;
}

function CalendarDays({ dates, primaryMonth, onDateClick }: ICalendarDaysProps) {
  function isLastMonthDate(date: Date) {
    return date.getMonth() + 1 < primaryMonth;
  }

  return (
    <>
      {[0, 1, 2, 3, 4, 5].map((week) => {
        return (
          <tr key={week}>
            {dates.slice(week * 7, ++week * 7).map((date: Date) => {
              return (
                <CalendarDay
                  key={date.getTime()}
                  date={date}
                  isCurrentDate={isToday(date)}
                  isPreviousMonthDate={isLastMonthDate(date)}
                  onClick={(date) => onDateClick(date)}
                />
              );
            })}
          </tr>
        );
      })}
    </>
  );
}

interface ICalendarDayProps {
    date: Date;
    isCurrentDate: boolean
    isPreviousMonthDate: boolean
    onClick: (date: Date) => void
}

function CalendarDay({ date, isCurrentDate, isPreviousMonthDate, onClick }: ICalendarDayProps) {
  return (
    <td
      className={`${styles["calendar-day"]} ${isCurrentDate && styles["today"]}`}
      onClick={() => onClick(date)}
    >
      <span style={{ opacity: `${!!isPreviousMonthDate && "0.6"}` }}>
        {date.getDate()}
      </span>
    </td>
  );
}
