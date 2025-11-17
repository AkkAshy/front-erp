import { useMutation, useQueryClient } from "@tanstack/react-query";
import { attributeApi } from "../api/attributeApi";
import type { AttributeValue } from "../api/types";

export const useUpdateAttributeValue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<AttributeValue> }) =>
      attributeApi.updateValue(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attributeValues"] });
      queryClient.invalidateQueries({ queryKey: ["attributeTypes"] });
    },
  });
};
