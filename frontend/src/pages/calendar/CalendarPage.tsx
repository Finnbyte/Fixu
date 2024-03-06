import { useEffect } from "react";
import Calendar from "../../components/Calendar/Calendar";
import styles from "./CalendarPage.module.scss";
import { addMonths, subMonths } from "date-fns";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import {
  setSelectedDate,
} from "../../slices/calendar";
import { useAppSelector } from "../../hooks/useAppSelector";
import {
  useGetMonthCalendarEventsQuery,
} from "../../slices/api";
import { EventsListing } from "../../components/EventListing/EventListing";

export default function CalendarPage() {
  const dispatch = useAppDispatch();
  const selectedDate = new Date(
    useAppSelector((state) => state.calendar.data.selectedDate)
  );

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;

  // No need to assign to any data since we only care about side effects
  // Check extraReducers in calendarSlice
  const { refetch: refetchMonthEvents } = useGetMonthCalendarEventsQuery({ year, month });

  useEffect(() => {
    refetchMonthEvents();
  }, [month, year, refetchMonthEvents])

  function handleMonthChange(newMonth: number) {
    // do this instead of setMonths since it doesn't account for year change
    const fn = newMonth < month ? subMonths : addMonths;
    const newSelectedDate = fn(selectedDate, 1).toISOString();
    dispatch(setSelectedDate(newSelectedDate));
  }

  return (
    <div className={styles.page}>
      <div className={styles["calendar-container"]}>
        <Calendar
          selectedDate={selectedDate}
          year={year}
          month={month}
          onScrollMonth={handleMonthChange}
        />
      </div>
      <EventsListing date={selectedDate} />
    </div>
  );
}
