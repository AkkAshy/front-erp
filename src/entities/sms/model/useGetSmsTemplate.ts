import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { smsApi } from "../api/smsApi";

type SmsTemplate = {
  id: number;
  name: string;
  content: string;
};

export const useGetSmsTemplate = (): UseQueryResult<
  { data: SmsTemplate[] },
  Error
> => {
  return useQuery({
    queryKey: ["get-sms-template"],
    queryFn: () => smsApi.getSmsTemplate(),
  });
};
