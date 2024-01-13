import { intervalToDuration, formatDuration } from "date-fns";

export function formatUptime(uptimeInSeconds: number): string {
  const uptimeDuration = intervalToDuration({ start: 0, end: uptimeInSeconds * 1000 });
  return formatDuration(uptimeDuration);
}

export function getUptimeHandler() {
  const uptimeInSeconds = process.uptime();
  return {
    msg: "I am alive.",
    uptime: formatUptime(uptimeInSeconds),
  };
}