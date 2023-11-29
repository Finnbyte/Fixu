import { formatDuration, intervalToDuration } from "date-fns";

export function uptime(start: Date, until: Date): string {
  const uptimeDuration = intervalToDuration({ start, end: until });
  return formatDuration(uptimeDuration);
}