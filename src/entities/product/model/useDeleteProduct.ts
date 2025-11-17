import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "../api/productApi";

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"], // тот же ключ, что и в useQuery
      });
    },
  });
};
