import { useState, useMemo } from "react";

export function usePagination(initialPage = 1, limit = 10) {
  const [page, setPage] = useState(initialPage);

  // offset всегда считается автоматически
  const offset = useMemo(
    () => (page - 1) * limit,
    [page, limit]
  );

  return {
    page, // номер страницы (для TablePagination)
    setPage, // меняем страницу
    limit, // сколько элементов на странице
    offset, // смещение (для API)
  };
}
