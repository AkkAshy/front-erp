import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { usersApi } from "../api/usersApi";
import type { ProfileResponse } from "../api/types";

export const useProfileInfo = (): UseQueryResult<ProfileResponse, Error> => {
  return useQuery({
    queryKey: ["profile-info"],
    queryFn: async () => {
      const response = await usersApi.profileInfo();
      return response.data;
    },
  });
};
