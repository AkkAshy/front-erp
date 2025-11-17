import { useMutation, useQueryClient } from "@tanstack/react-query";
import { attributeApi } from "../api";
import type { CreateAttributeValue } from "../api/types";

export const useCreateAttributeValue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAttributeValue) => attributeApi.createValue(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attributeValues"] });
      queryClient.invalidateQueries({ queryKey: ["attributeTypes"] });
    },
  });
};
