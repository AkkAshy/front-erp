import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customersApi } from "../api/customersApi";

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: customersApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      });
    },
  });
};
