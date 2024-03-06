import { addMinutes, eachDayOfInterval, endOfMonth, startOfMonth, subDays } from "date-fns";

export function offsetDateByLocal(date: Date) {
  const diff = new Date().getTimezoneOffset();
  return addMinutes(date, diff)
}

export function getDatesInMonth(month: number, year: number): Date[] {
  const start = startOfMonth(new Date(year, month - 1, 15));
  const end = endOfMonth(start);

  return eachDayOfInterval({ start, end });
}

export function getOffsetDatesInMonth(firstDateOfMonth: Date) {
  const offsetAmount = firstDateOfMonth.getDay() - 1;
  return Array.from({ length: offsetAmount }).map((_, i) =>
    subDays(firstDateOfMonth, offsetAmount - i)
  );
}

export function isLastMonthDate(date: Date, currentMonthIndex: number) {
  return date.getMonth() + 1 < currentMonthIndex;
}