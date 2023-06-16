import dayjs from "dayjs";

export function secondsToTimestamp(
  seconds: number,
  format = "HH:mm:ss.SSS"
): string {
  return dayjs(seconds * 1000).format(format);
}
