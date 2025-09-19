import { DateTime } from "luxon";

export function formatShort(utcString: string) {
  const dt = DateTime.fromISO(utcString, { zone: "utc" }).toLocal();
  return `${dt.toRelativeCalendar()}, ${dt.toFormat("HH:mm")}`;
}
