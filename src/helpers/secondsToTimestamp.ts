import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export function secondsToTimestamp(
  seconds: number,
  format = "HH:mm:ss.SSS"
): string {
  return dayjs(seconds * 1000)
    .utc()
    .format(format);
}
