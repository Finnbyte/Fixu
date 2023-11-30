import { formatDuration, intervalToDuration } from "date-fns";

export function formatUptime(uptimeInSeconds: number): string {
  const uptimeDuration = intervalToDuration({ start: 0, end: uptimeInSeconds * 1000 });
  return formatDuration(uptimeDuration);
}