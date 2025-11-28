import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shiftApi } from "../api/shiftApi";
import type { CloseShiftRequest, CloseShiftResponse} from "../api/shiftTypes";
import type { AxiosResponse } from "axios";

export const useCloseShift = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AxiosResponse<CloseShiftResponse>,
    Error,
    { shiftId: number; data: CloseShiftRequest }
  >({
    mutationFn: ({ shiftId, data }) =>
      shiftApi.closeShift(shiftId, data),
    onSuccess: () => {
      // Обновляем текущую смену
      queryClient.invalidateQueries({ queryKey: ["currentShift"] });
      // Обновляем список смен
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
    },
  });
};
