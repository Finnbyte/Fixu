import { AddCircle } from "@mui/icons-material";
import { createId } from "@paralleldrive/cuid2";
import { format } from "date-fns";
import { CalendarEvent } from "../../../../backend/db/schemas/calendarEvents";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useDeleteCalendarEventMutation } from "../../slices/api";
import { selectEventsByDate, addCalendarEvent, deleteCalendarEvent } from "../../slices/calendar";
import { EventListingItem } from "./EventListingItem";
import styles from "./EventListing.module.scss";

export function EventsListing({ date }: { date: Date }) {
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

