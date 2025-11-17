import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../api/analyticsApi";

export const useSalesAnalytics = (params: {
  date_gte: string;
  date_lte: string;
}) =>
  useQuery({
    queryKey: ["sales-analytics", params],
    // getSales не существует, используем getPeriodReport
    queryFn: () =>
      analyticsApi.getPeriodReport(params.date_gte, params.date_lte).then((res: any) => res.data),
  });
