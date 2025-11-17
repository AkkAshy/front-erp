import { useMutation } from "@tanstack/react-query";
import { smsApi } from "../api/smsApi";

export const useSendSms = () => {
  return useMutation({
    mutationFn: smsApi.sendSms,
  });
};
