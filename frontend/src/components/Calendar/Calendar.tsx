import { eachDayOfInterval, endOfMonth, isSameDay, isToday, startOfMonth, subDays } from "date-fns";
import styles from "./Calendar.module.scss";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { setSelectedDate, isDateEventful } from "../../slices/calendar";
import classnames from "classnames";

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

interface ICalendarProps {
  month: number
  year: number
}

const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Calendar(props: ICalendarProps) {
  const dates = getDatesInMonth(props.month, props.year);
  const offsetDates = getOffsetDatesInMonth(dates[0]);

  return (
    <table id={styles.calendar}>
      <tr>
        {dayLabels.map((label) => (
          <th key={label}>
            <span>{label}</span>
          </th>
        ))}
      </tr>
      <CalendarDays
        dates={[...offsetDates, ...dates]}
        month={props.month}
      />
    </table>
  );
}

interface ICalendarDaysProps {
    dates: Date[];
    month: number;
}

function CalendarDays({ dates, month }: ICalendarDaysProps) {
  const calendar = useAppSelector(state => state.calendar.data);
  const dispatch = useAppDispatch();

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
                  isSelected={isSameDay(calendar.selectedDate, date)}
                  isCurrentDate={isToday(date)}
                  isPreviousMonthDate={isLastMonthDate(date, month)}
                  onClick={(date) => dispatch(setSelectedDate(date.toISOString()))}
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
    isSelected: boolean
    isPreviousMonthDate: boolean
    onClick: (date: Date) => void
}

function CalendarDay({ date, isSelected, isCurrentDate, isPreviousMonthDate, onClick }: ICalendarDayProps) {
  const hasEvents = useAppSelector(state => isDateEventful(state, date));
  return (
    <td
      className={classnames(styles["day"], { [styles.selected]: isSelected, [styles.today]: isCurrentDate })}
      onClick={() => onClick(date)}
    >
      <span style={{ opacity: `${isPreviousMonthDate && "0.6"}` }}>
        {date.getDate()}
      </span>
      <div className={`${hasEvents && styles["dot"]}`} />
    </td>
  );
}
