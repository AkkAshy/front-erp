import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "../api/categoryApi";

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      name,
      attribute_types,
    }: {
      id: number;
      name?: string;
      attribute_types?: number[];
    }) => categoryApi.update(id, { name, attribute_types }),
    onSuccess: () => {
      // Обновляем список
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
