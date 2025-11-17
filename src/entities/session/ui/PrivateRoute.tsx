import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/entities/session/model/useAuth";
import Loader from "@/shared/ui/Loader";

export const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loader fullScreen={true} />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
};
