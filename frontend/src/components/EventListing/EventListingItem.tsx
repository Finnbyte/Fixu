import { useRef } from "react";
import { Delete } from "react-feather";
import { CalendarEvent } from "../../../../backend/db/schemas/calendarEvents";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useCreateCalendarEventMutation, useUpdateCalendarEventMutation } from "../../slices/api";
import { updateCalendarEvent } from "../../slices/calendar";

interface EventListingItemProps {
  event: CalendarEvent;
  onDiscard: () => void;
}

export function EventListingItem({ event, onDiscard }: EventListingItemProps) {
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
