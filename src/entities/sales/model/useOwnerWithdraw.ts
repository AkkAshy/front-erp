import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shiftApi } from "../api/shiftApi";
import type { OwnerWithdrawRequest, OwnerWithdrawResponse } from "../api/shiftTypes";
import type { AxiosResponse } from "axios";

export const useOwnerWithdraw = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<OwnerWithdrawResponse>,
    Error,
    OwnerWithdrawRequest
  >({
    mutationFn: (data) => shiftApi.ownerWithdraw(data),
    onSuccess: () => {
      // Обновляем текущую смену (баланс изменился)
      queryClient.invalidateQueries({ queryKey: ["currentShift"] });
      // Обновляем список движений
      queryClient.invalidateQueries({ queryKey: ["cashMovements"] });
    },
  });
};
