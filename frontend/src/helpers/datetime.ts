import { addMinutes } from "date-fns";

export function offsetDateByLocal(date: Date) {
  const diff = new Date().getTimezoneOffset();
  return addMinutes(date, diff)
}