import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../api/analyticsApi";
import { format, parseISO } from "date-fns";

type RawTransactionByDay = Record<string, number>;

export const useTransactionsByDay = (params: {
  date_from: string;
  date_to: string;
}) =>
  useQuery({
    queryKey: ["transactions-by-day", params],
    // getTransactionsByDay не существует, используем getPeriodReport
    queryFn: () =>
      analyticsApi.getPeriodReport(params.date_from, params.date_to).then((res: any) =>
        res.data?.transactions_by_day?.map((item: RawTransactionByDay) => {
          const key = Object.keys(item)[0];
          const val = Object.values(item)[0];

          return {
            date: format(parseISO(key), "dd.MM"),
            value: Number(val),
          };
        })
      ),
  });
