import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../api/analyticsApi";
import { format, parseISO } from "date-fns";

type DailyReport = {
  id: number;
  date: string;
  total_sales: string;
  total_sales_count: number;
  avg_sale_amount: string;
  cash_sales: string;
  card_sales: string;
  credit_sales: string;
  total_discount: string;
  total_tax: string;
  total_items_sold: number;
  unique_products_sold: number;
  unique_customers: number;
  new_customers: number;
  sessions_opened: number;
  sessions_closed: number;
  created_at: string;
  updated_at: string;
};

export const useTransactionsByDay = (params: {
  date_from: string;
  date_to: string;
}) =>
  useQuery({
    queryKey: ["transactions-by-day", params],
    queryFn: () =>
      analyticsApi.getPeriodReport(params.date_from, params.date_to).then((res: any) => {
        // Новый формат API возвращает daily_reports
        const dailyReports = res.data?.daily_reports || [];

        return dailyReports.map((report: DailyReport) => ({
          date: format(parseISO(report.date), "dd.MM"),
          value: parseFloat(report.total_sales),
        }));
      }),
  });
