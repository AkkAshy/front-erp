import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { usersApi } from "../api/usersApi";
import type { UserInfo } from "../api/types";

export const useProfileInfo = (): UseQueryResult<{ data: UserInfo }, Error> => {
  return useQuery({
    queryKey: ["profile-info"],
    queryFn: () => usersApi.profileInfo(),
  });
};
