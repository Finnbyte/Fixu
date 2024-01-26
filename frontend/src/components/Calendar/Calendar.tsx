import { eachDayOfInterval, endOfMonth, isSameDay, isToday, startOfMonth, subDays } from "date-fns";
import styles from "./Calendar.module.scss";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { setSelectedDate, isDateEventful } from "../../slices/calendar";
import classnames from "classnames";
import { CalendarEvent, CalendarEventType } from "../../../../backend/db/schemas/calendarEvents";
import { stringify } from "querystring";
import { type } from "os";
import { useMemo } from "react";

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

function isLastMonthDate(date: Date, currentMonthIndex: number) {
  return date.getMonth() + 1 < currentMonthIndex;
}

function buildEventsMap(events: CalendarEvent[]) { 
  const map = new Map<number, { title: string, type: CalendarEventType }>();
  for (const event of events) {
    const monthDate = new Date(event.date).getDate();
    map.set(monthDate, { title: event.title, type: event.type });
  }
  return map;
}

interface ICalendarProps {
  events: CalendarEvent[]
  month: number
  year: number
}

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Calendar(props: ICalendarProps) {
  const dispatch = useAppDispatch();
  const selectedDate = useAppSelector(state => state.calendar.data.selectedDate);

  const monthDates = getDatesInMonth(props.month, props.year);
  const offsetDates = getOffsetDatesInMonth(monthDates[0]);
  const dates = [...offsetDates, ...monthDates];

  const events = useMemo(() => buildEventsMap(props.events), [props.events]);

  function Week() {
    return (
      <>
        {[0, 1, 2, 3, 4, 5].map((week) => {
          return (
            <tr className={styles.week} key={week}>
              {dates.slice(week * 7, ++week * 7).map((date: Date) => {
                return (
                  <CalendarDay
                    key={date.getTime()}
                    date={date}
                    isEventful={!!events.get(date.getDate())}
                    isSelected={isSameDay(selectedDate, date)}
                    isCurrentDate={isToday(date)}
                    isPreviousMonthDate={isLastMonthDate(date, props.month)}
                    onClick={(date) =>
                      dispatch(setSelectedDate(date.toISOString()))
                    }
                  />
                );
              })}
            </tr>
          );
        })}
      </>
    );
  }

  return (
    <table id={styles.calendar}>
      <tr>
        {dayLabels.map((label) => (
          <th key={label}>
            <span>{label}</span>
          </th>
        ))}
      </tr>
      <Week />
    </table>
  );
}

interface ICalendarDayProps {
    date: Date;
    isCurrentDate: boolean
    isSelected: boolean
    isEventful: boolean
    isPreviousMonthDate: boolean
    onClick: (date: Date) => void
}

function CalendarDay({ date, isEventful, isSelected, isCurrentDate, isPreviousMonthDate, onClick }: ICalendarDayProps) {
  return (
    <td
      className={classnames(styles["day"], { [styles.selected]: isSelected, [styles.today]: isCurrentDate })}
      onClick={() => onClick(date)}
    >
      <span style={{ opacity: `${isPreviousMonthDate && "0.6"}` }}>
        {date.getDate()}
      </span>
      <div className={`${isEventful && styles["dot"]}`} />
    </td>
  );
}
