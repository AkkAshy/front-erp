import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shiftApi } from "../api/shiftApi";
import type { OpenShiftRequest } from "../api/shiftTypes";

export const useOpenShift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OpenShiftRequest) => shiftApi.openShift(data),
    onSuccess: () => {
      // Обновляем текущую смену
      queryClient.invalidateQueries({ queryKey: ["currentShift"] });
      // Обновляем список смен
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
    },
  });
};
