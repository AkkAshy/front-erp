import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "../api/productApi";

export const useDeleteSize = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productApi.deleteSize,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sizes"], // тот же ключ, что и в useQuery
      });
    },
  });
};
