import { isSameDay, isToday } from "date-fns";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { setSelectedDate } from "../../slices/calendar";
import { CalendarDay } from "./CalendarDay";
import styles from "./CalendarWeek.module.scss";
import { isLastMonthDate } from "../../helpers/datetime";

interface ICalendarWeekProps {
    month: number;
    dates: Date[];
}

export function CalendarWeek({ month, dates }: ICalendarWeekProps) {
  const dispatch = useAppDispatch();
  const selectedDate = useAppSelector(
    (state) => state.calendar.data.selectedDate
  );
  const eventsForMonth = useAppSelector((state) => state.calendar.data.events);
  return (
    <>
      <tr className={styles.week}>
        {dates.map((date: Date) => (
          <CalendarDay
            key={date.getTime()}
            date={date}
            isEventful={eventsForMonth.some((e) => isSameDay(e.date, date))}
            isSelected={isSameDay(selectedDate, date)}
            isCurrentDate={isToday(date)}
            isPreviousMonthDate={isLastMonthDate(date, month)}
            onClick={(date) => dispatch(setSelectedDate(date.toISOString()))}
          />
        ))}
      </tr>
    </>
  );
}