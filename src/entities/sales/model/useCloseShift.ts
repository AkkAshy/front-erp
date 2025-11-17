import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shiftApi } from "../api/shiftApi";
import type { CloseShiftRequest } from "../api/shiftTypes";

export const useCloseShift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ shiftId, data }: { shiftId: number; data: CloseShiftRequest }) =>
      shiftApi.closeShift(shiftId, data),
    onSuccess: () => {
      // Обновляем текущую смену
      queryClient.invalidateQueries({ queryKey: ["currentShift"] });
      // Обновляем список смен
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
    },
  });
};
