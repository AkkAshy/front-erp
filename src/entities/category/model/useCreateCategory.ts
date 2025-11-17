import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "../api/categoryApi";

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
