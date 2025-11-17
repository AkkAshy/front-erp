import { useMutation } from "@tanstack/react-query";
import { sessionApi } from "@/entities/session/api/sessionApi";
import type { RegisterData } from "@/entities/session/api/types";

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterData) =>
      sessionApi.register(data),
  });
};
