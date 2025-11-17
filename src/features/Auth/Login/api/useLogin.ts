import { useMutation } from "@tanstack/react-query";
import { sessionApi } from "@/entities/session/api/sessionApi";
import type { LoginData } from "@/entities/session/api/types";

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginData) => sessionApi.login(data),
    // ⭐ Токены и tenant_key уже сохраняются в sessionApi.login()
  });
};
