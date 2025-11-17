import { format, subDays, subMonths, subYears } from "date-fns";

export function getDateRange(key: string) {
  const endDate = new Date();
  let startDate: Date;

  switch (key) {
    case "15d":
      startDate = subDays(endDate, 15);
      break;
    case "1m":
      startDate = subMonths(endDate, 1);
      break;
    case "3m":
      startDate = subMonths(endDate, 3);
      break;
    case "6m":
      startDate = subMonths(endDate, 6);
      break;
    case "1y":
      startDate = subYears(endDate, 1);
      break;
    default:
      throw new Error(`Unknown period key: ${key}`);
  }

  return {
    startDate: format(startDate, "yyyy-MM-dd"),
    endDate: format(endDate, "yyyy-MM-dd"),
  };
}
