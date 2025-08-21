// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../types";

interface Props {
  role: UserRole;
  children: JSX.Element;
}

export const ProtectedRoute = ({ role, children }: Props) => {
  const { role: userRole } = useAuth();

  if (!userRole) return <Navigate to="/login" replace />;
  if (userRole !== role) return <Navigate to="/" replace />;

  return children;
};
