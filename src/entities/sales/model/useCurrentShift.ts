import { useQuery } from "@tanstack/react-query";
import { shiftApi } from "../api/shiftApi";
import type { CashierShift } from "../api/shiftTypes";

export const useCurrentShift = () => {
  return useQuery<CashierShift, Error>({
    queryKey: ["currentShift"],
    queryFn: async () => {
      const response = await shiftApi.getCurrentShift();
      console.log('📡 API Response (getCurrentShift):', response);
      console.log('📡 response.data:', response.data);
      console.log('📡 response.data.data:', response.data?.data);

      // API может возвращать { data: CashierShift } или просто CashierShift
      const shift = response.data?.data || response.data;
      console.log('📡 Final shift object:', shift);
      return shift;
    },
    retry: false,
    staleTime: 30 * 1000, // 30 секунд
  });
};
