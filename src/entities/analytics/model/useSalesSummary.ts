import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { analyticsApi } from "../api/analyticsApi";
import type { PaymentSummaryResponse } from "../api/types";

export const useSalesSummary = (params: {
  start_date: string;
  end_date: string;
}): UseQueryResult<PaymentSummaryResponse, Error> =>
  useQuery({
    queryKey: ["sales-summary", params],
    // getSalesSummary не существует, используем getPeriodReport как аналог
    queryFn: () =>
      analyticsApi.getPeriodReport(params.start_date, params.end_date).then((res: any) => res.data),
  });
