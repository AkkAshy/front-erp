import { useMutation, useQueryClient } from "@tanstack/react-query";
import { attributeApi } from "../api/attributeApi";

export const useDeleteAttributeValue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => attributeApi.deleteValue(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attributeValues"] });
      queryClient.invalidateQueries({ queryKey: ["attributeTypes"] });
    },
  });
};
