import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { analyticsApi } from "../api/analyticsApi";
import type { PaymentSummaryResponse, PeriodReportResponse } from "../api/types";

export const useSalesSummary = (params: {
  start_date: string;
  end_date: string;
}): UseQueryResult<PaymentSummaryResponse, Error> =>
  useQuery({
    queryKey: ["sales-summary", params],
    queryFn: async () => {
      const res = await analyticsApi.getPeriodReport(params.start_date, params.end_date);
      const data: PeriodReportResponse = res.data;

      // Проверяем наличие данных
      if (!data || !data.totals || !data.daily_reports) {
        return {
          payment_summary: [],
          total_amount: 0,
          total_transactions: 0,
          total_items_sold: 0,
        };
      }

      // Преобразуем новый формат API в старый формат для совместимости
      const paymentSummary: any[] = [];

      // Подсчитываем суммы по каждому способу оплаты
      let totalCash = 0;
      let totalCard = 0;
      let totalCredit = 0;

      data.daily_reports.forEach(report => {
        totalCash += parseFloat(report.cash_sales || "0");
        totalCard += parseFloat(report.card_sales || "0");
        totalCredit += parseFloat(report.credit_sales || "0");
      });

      // Формируем payment_summary только для непустых методов
      if (totalCash > 0) {
        paymentSummary.push({
          payment_method: "cash",
          total_amount: totalCash,
          total_transactions: data.totals.total_count || 0,
          total_items_sold: data.totals.total_items || 0,
        });
      }

      if (totalCard > 0) {
        paymentSummary.push({
          payment_method: "card",
          total_amount: totalCard,
          total_transactions: data.totals.total_count || 0,
          total_items_sold: data.totals.total_items || 0,
        });
      }

      if (totalCredit > 0) {
        paymentSummary.push({
          payment_method: "debt",
          total_amount: totalCredit,
          total_transactions: data.totals.total_count || 0,
          total_items_sold: data.totals.total_items || 0,
        });
      }

      return {
        payment_summary: paymentSummary,
        total_amount: data.totals.total_sales || 0,
        total_transactions: data.totals.total_count || 0,
        total_items_sold: data.totals.total_items || 0,
      };
    },
  });
