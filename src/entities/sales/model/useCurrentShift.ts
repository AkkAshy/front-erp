import { useQuery } from "@tanstack/react-query";
import { shiftApi } from "../api/shiftApi";
import type { CashierShift } from "../api/shiftTypes";

export const useCurrentShift = () => {
  return useQuery<{ data: CashierShift }, Error>({
    queryKey: ["currentShift"],
    queryFn: shiftApi.getCurrentShift,
    retry: false,
    staleTime: 30 * 1000, // 30 секунд
  });
};
