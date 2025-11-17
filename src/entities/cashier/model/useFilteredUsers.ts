import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { usersApi } from "../api/usersApi";
import type { Employees, User } from "../api/types";

export const useFilteredUsers = (filters: {
  id: number | string;
  name?: string;
  is_active?: boolean;
}): UseQueryResult<Employees, Error> => {
  return useQuery({
    queryKey: ["users", filters],
    queryFn: () => usersApi.filterUsers(filters.id, filters.name, filters.is_active).then(res => {
      // API возвращает пагинированный ответ: { count, next, previous, results: [...] }
      return res.data.results || res.data;
    }),
    staleTime: 5 * 60 * 1000,
  });
};

export const useUser = (filters: {
  id: number | string;
}): UseQueryResult<User, Error> => {
  return useQuery({
    queryKey: ["user", filters.id], // Изменили ключ для более точного кэширования
    queryFn: () => usersApi.getUser(filters.id).then(res => {
      console.log("Fetching user data for ID:", filters.id);
      console.log("Received user data:", res.data);
      return res.data;
    }),
    // Запрос выполняется только если есть валидный ID
    enabled: !!filters.id && filters.id !== "",
    // Убираем staleTime чтобы всегда загружать свежие данные
    staleTime: 0,
  });
};
