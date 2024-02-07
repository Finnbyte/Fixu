import { useRef } from "react";
import Calendar from "../../components/Calendar/Calendar";
import { AddCircle, Delete } from "@mui/icons-material";
import styles from "./CalendarPage.module.scss";
import { addMonths, format, subMonths } from "date-fns";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import {
  addCalendarEvent,
  deleteCalendarEvent,
  selectEventsByDate,
  setSelectedDate,
  updateCalendarEvent,
} from "../../slices/calendar";
import { CalendarEvent } from "../../../../backend/db/schemas/calendarEvents";
import { useAppSelector } from "../../hooks/useAppSelector";
import {
  useCreateCalendarEventMutation,
  useDeleteCalendarEventMutation,
  useGetMonthCalendarEventsQuery,
  useUpdateCalendarEventMutation,
} from "../../slices/api";
import { createId } from "@paralleldrive/cuid2";

interface EventListingItemProps {
  event: CalendarEvent;
  onDiscard: () => void;
}

function EventListingItem({ event, onDiscard }: EventListingItemProps) {
  const dispatch = useAppDispatch();
  const [createCalendarEventQuery] = useCreateCalendarEventMutation();
  const [updateCalendarEventQuery] = useUpdateCalendarEventMutation();

  const titleRef = useRef<HTMLInputElement>(null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    } else if (e.key === "Escape") {
      onDiscard();
    }
  }

  function handleInputBlur() {
    if (!titleRef.current) {
      return;
    }

    const title = titleRef.current.value;
    if (title === "") {
      onDiscard();
      return;
    }

    const newEvent = { ...event, title };

    // Changes always need to be applied client-side
    // since all EventListingItems already have a event attached to them
    dispatch(updateCalendarEvent(newEvent));

    // We need to know if its updated or a new event
    // This is a good way to know it, since authorId is assigned server-side
    const isFreshlyCreatedEvent = !newEvent.authorId;
    if (isFreshlyCreatedEvent) {
      createCalendarEventQuery({ event: newEvent });
    } else {
      updateCalendarEventQuery({ event: newEvent });
    }
  }

  return (
    <li>
      <div>
        <input
          type="text"
          ref={titleRef}
          defaultValue={event.title}
          onKeyDown={handleKeyDown}
          onBlur={handleInputBlur}
        />
        <span style={{ cursor: "pointer" }} onClick={() => onDiscard()}>
          <Delete />
        </span>
      </div>
    </li>
  );
}

function EventsListing({ date }: { date: Date }) {
  console.log("rerender eventlisting");
  const events = useAppSelector((state) => selectEventsByDate(state, date));
  const [deleteCalendarEventQuery] = useDeleteCalendarEventMutation();
  const dispatch = useAppDispatch();

  function handleCreateNewEvent() {
    const newEvent = {
      id: createId(), // Generate a random client-side id which will be overriden server-side
      date: date.toISOString(),
      title: "",
      type: "personal",
      isPushed: false,
    } as unknown as CalendarEvent;
    dispatch(addCalendarEvent(newEvent));
  }

  function handleDiscardEvent(event: CalendarEvent) {
    if (event.title === "") {
      dispatch(deleteCalendarEvent(event));
    } else {
      // TODO discard from db
      deleteCalendarEventQuery({ event });
    }
  }

  return (
    <div className={styles["events-listing"]}>
      <div className={styles["top-row"]}>
        <span>{format(date, "MMM d, EEEE")}</span>
        <div style={{ cursor: "pointer" }} onClick={handleCreateNewEvent}>
          <AddCircle />
        </div>
      </div>
      <ul>
        {events.map((event) => (
          <EventListingItem
            key={event.id}
            event={event}
            onDiscard={() => handleDiscardEvent(event)}
          />
        ))}
      </ul>
    </div>
  );
}

export default function CalendarPage() {
  const dispatch = useAppDispatch();
  const selectedDate = new Date(
    useAppSelector((state) => state.calendar.data.selectedDate)
  );

  console.log("selected", selectedDate);

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;

  // No need to assign since we only care about side effects
  // Check extraReducers in calendarSlice
  useGetMonthCalendarEventsQuery({ year, month });

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
