import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shiftApi } from "../api/shiftApi";
import type { OpenShiftRequest, OpenShiftResponse } from "../api/shiftTypes";
import type { AxiosResponse } from "axios";

export const useOpenShift = () => {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<OpenShiftResponse>, Error, OpenShiftRequest | undefined>({
    mutationFn: (data?: OpenShiftRequest) => shiftApi.openShift(data),
    onSuccess: () => {
      // Обновляем текущую смену
      queryClient.invalidateQueries({ queryKey: ["currentShift"] });
      // Обновляем список смен
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
    },
  });
};
