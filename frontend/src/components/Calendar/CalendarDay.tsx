import * as classnames from "classnames";
import styles from "./CalendarDay.module.scss";

interface ICalendarDayProps {
    date: Date;
    isCurrentDate: boolean
    isSelected: boolean
    isEventful: boolean
    isPreviousMonthDate: boolean
    onClick: (date: Date) => void
}

export function CalendarDay({ date, isEventful, isSelected, isCurrentDate, isPreviousMonthDate, onClick }: ICalendarDayProps) {
  return (
    <td
      className={classnames(styles["calendar-day"], { [styles.selected]: isSelected, [styles.today]: isCurrentDate })}
      onClick={() => onClick(date)}
    >
      <span style={{ opacity: `${isPreviousMonthDate && "0.6"}` }}>
        {date.getDate()}
      </span>
      <div className={`${isEventful && styles["event-dot"]}`} />
    </td>
  );
}
