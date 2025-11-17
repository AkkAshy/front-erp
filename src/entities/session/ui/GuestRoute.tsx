import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/entities/session/model/useAuth";
import Loader from "@/shared/ui/Loader";

export const GuestRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  // Если авторизован - редирект на главную
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
