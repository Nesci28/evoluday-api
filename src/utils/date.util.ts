import * as moment from "moment-timezone";

type UnitOfTime =
  | "year"
  | "years"
  | "y"
  | "month"
  | "months"
  | "M"
  | "week"
  | "weeks"
  | "w"
  | "day"
  | "days"
  | "d"
  | "hour"
  | "hours"
  | "h"
  | "minute"
  | "minutes"
  | "m"
  | "second"
  | "seconds"
  | "s"
  | "millisecond"
  | "milliseconds"
  | "ms";

export class DateUtil {
  public static newDate(): Date {
    const now = moment().utc().toDate();
    const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    return utc;
  }

  public static getTimeFromDate(date: Date): string {
    const momentDate = moment(date);
    const time = momentDate.format("HH:mm:ss");
    return time;
  }

  public static getTimezoneOffset(timezone: string): number {
    const timezoneOffset = moment.tz(timezone).utcOffset();
    return timezoneOffset;
  }

  public static getYearDifference(date: Date, compareDate: Date): number {
    const momentDate = moment(date).utc();
    const momentCompareDate = moment(compareDate).utc();
    const difference = momentCompareDate.diff(momentDate, "years");
    return difference;
  }

  public static getSecondDifference(date: Date, compareDate: Date): number {
    const momentDate = moment(date).utc();
    const momentCompareDate = moment(compareDate).utc();
    const difference = momentCompareDate.diff(momentDate, "seconds");
    return difference;
  }

  public static isAfter(date: Date, compareDate: Date): boolean {
    const momentDate = moment(date).utc();
    const momentCompareDate = moment(compareDate).utc();
    const isAfterCompare = momentCompareDate.isAfter(momentDate);
    return isAfterCompare;
  }

  public static isBefore(date: Date, compareDate: Date): boolean {
    const momentDate = moment(date).utc();
    const momentCompareDate = moment(compareDate).utc();
    const isBefore = momentCompareDate.isBefore(momentDate);
    return isBefore;
  }

  public static parse(dateStr: string, format: string): Date {
    const momentDate = moment(dateStr, format);
    const parsedDate = momentDate.utc().toDate();
    return parsedDate;
  }

  public static isSameDay(date: Date, compareDate: Date): boolean {
    const momentDate = moment(date).utc();
    const momentCompareDate = moment(compareDate).utc();
    const isSameDayDate = momentDate.isSame(momentCompareDate, "date");
    return isSameDayDate;
  }

  public static isBetween(date: Date, startDate: Date, endDate: Date): boolean {
    const momentDate = moment(date).utc();
    const momentStartDate = moment(startDate).utc();
    const momentEndDate = moment(endDate).utc();

    const isBetweenDates = momentDate.isBetween(
      momentStartDate,
      momentEndDate,
      undefined,
      "[]",
    );
    return isBetweenDates;
  }

  public static startOfDay(date: Date): Date {
    const momentDate = moment(date);
    const startOfDayDate = momentDate.startOf("day").utc().toDate();
    return startOfDayDate;
  }

  public static endOfDay(date: Date): Date {
    const momentDate = moment(date);
    const endOfDayDate = momentDate.endOf("day").utc().toDate();
    return endOfDayDate;
  }

  public static getWeekDayName(date: Date): string {
    const momentDate = moment(date);
    const weekDayName = momentDate.utc().format("dddd").toLowerCase();
    return weekDayName;
  }

  public static addToDate(date: Date, amount: number, type: UnitOfTime): Date {
    const momentDate = moment(date);
    momentDate.add(amount, type);
    const setDate = momentDate.utc().toDate();
    return setDate;
  }

  public static subtractToDate(
    date: Date,
    amount: number,
    type: UnitOfTime,
  ): Date {
    const momentDate = moment(date);
    momentDate.subtract(amount, type);
    const setDate = momentDate.utc().toDate();
    return setDate;
  }

  public static setToTime(date: Date, timeStr: string): Date {
    const dateStr = date.toISOString().split("T").shift();
    const timeAndDate = moment(`${dateStr} ${timeStr}`).utc().toDate();
    return timeAndDate;
  }

  public static format(date: Date, format: string): string {
    const momentDate = moment(date);
    const formatDate = momentDate.utc().format(format);
    return formatDate;
  }

  /**
   * time in format 24:00:00
   * */
  public static setTimetoDate(
    date: Date,
    time: string,
    originalTimezone: string,
  ): Date {
    const momentDate = moment(date);
    const offsetInSeconds = DateUtil.getTimezoneOffset(originalTimezone) * 60;
    const [hour, minute, second] = time.split(":");
    const hourInSeconds = +hour * 60 * 60;
    const minuteInSeconds = +minute * 60;
    const timeInSeconds = hourInSeconds + minuteInSeconds + +second;
    const diffInSeconds = timeInSeconds + offsetInSeconds;

    const addingDay = diffInSeconds < 0 ? 1 : 0;
    momentDate
      .add(addingDay, "day")
      .set({ hour: +hour, minute: +minute, second: +second });

    const setDate = momentDate.utc().toDate();
    return setDate;
  }
}
