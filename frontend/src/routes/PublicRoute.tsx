import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { JSX } from "react";

interface PublicRouteProps {
  children: JSX.Element;
  restricted?: boolean; // если true — страница закрыта для авторизованных
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children, restricted = false }) => {
  const { isAuth } = useAuth();

  if (isAuth && restricted) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
