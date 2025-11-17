import { useQuery } from "@tanstack/react-query";
// import { sessionApi } from "./sessionApi";

export const useSessionQuery = () => {
  return useQuery({
    queryKey: ["session"],
    // queryFn: sessionApi.getMe, // GET /auth/me
    staleTime: 5 * 60 * 1000, // 5 мин
    retry: false,
  });
};
