import { useEffect, useState } from "react";
import { getAccessToken, refreshTokens } from "@/shared/api/auth/tokenService";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authCheckTrigger, setAuthCheckTrigger] = useState(0);

  useEffect(() => {
    let isMounted = true; // защита от утечек памяти при анмаунте

    const checkAuth = async () => {
      try {
        const token = getAccessToken();

        if (token) {
          if (isMounted) {
            setIsAuthenticated(true);
            setIsLoading(false);
          }
        } else {
          // Если нет accessToken, пробуем обновить его
          const newToken = await refreshTokens();

          if (isMounted) {
            setIsAuthenticated(!!newToken);
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error("Ошибка при проверке авторизации:", error);
        if (isMounted) {
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    // Слушаем изменения в localStorage (когда логин происходит в другой вкладке)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "accessToken") {
        setAuthCheckTrigger((prev) => prev + 1);
      }
    };

    // Слушаем кастомное событие для обновления в той же вкладке
    const handleAuthChange = () => {
      setAuthCheckTrigger((prev) => prev + 1);
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth-changed", handleAuthChange);

    return () => {
      isMounted = false;
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth-changed", handleAuthChange);
    };
  }, [authCheckTrigger]); // Перепроверяем при изменении trigger

  return { isAuthenticated, isLoading };
};
