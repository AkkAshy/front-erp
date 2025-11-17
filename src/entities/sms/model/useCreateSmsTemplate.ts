import { useMutation, useQueryClient } from "@tanstack/react-query";
import { smsApi } from "../api/smsApi";

export const useCreateSmsTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: smsApi.createSmsTemplate,
    onSuccess: () => {
      // Обновляем список размеров
      queryClient.invalidateQueries({ queryKey: ["get-sms-template"] });
    },
  });
};
