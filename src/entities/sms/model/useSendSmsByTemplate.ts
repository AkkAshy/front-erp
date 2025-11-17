import { useMutation } from "@tanstack/react-query";
import { smsApi } from "../api/smsApi";

export const useSendSmsByTemplate = () => {
  return useMutation({
    mutationFn: smsApi.sendSmsByTemplate,
  });
};
