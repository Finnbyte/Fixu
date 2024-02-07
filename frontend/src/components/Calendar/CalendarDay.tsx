import * as classnames from "classnames";
import styles from "./CalendarDay.module.scss";
import { CalendarEvent } from "../../../../backend/db/schemas/calendarEvents";

interface ICalendarDayProps {
    date: Date;
    isCurrentDate: boolean
    isSelected: boolean
    previewEvent: CalendarEvent | undefined
    isPreviousMonthDate: boolean
    onClick: (date: Date) => void
}

export function CalendarDay({
  date,
  previewEvent,
  isSelected,
  isCurrentDate,
  isPreviousMonthDate,
  onClick,
}: ICalendarDayProps) {
  return (
    <td
      className={classnames(styles["calendar-day"], {
        [styles.selected]: isSelected,
        [styles.today]: isCurrentDate,
      })}
      onClick={() => onClick(date)}
    >
      <span style={{ opacity: `${isPreviousMonthDate && "0.6"}` }}>
        {date.getDate()}
      </span>
      {!!previewEvent && (
        <p className={styles["event-preview-title"]}>{previewEvent.title}</p>
      )}
    </td>
  );
}
