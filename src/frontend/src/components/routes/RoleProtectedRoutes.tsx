import { Navigate, Outlet, useLocation } from "react-router";
import { useUser } from "../../contexts/UserContext";

type Props = {
  allowedRoles: string[];
};

export default function RoleProtectedRoutes({ allowedRoles }: Props) {
  const { user, loading } = useUser();
  const location = useLocation();

  if (loading) {
    return <div className="flex justify-center py-10">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const hasRole = allowedRoles.includes(user.role);

  if (!hasRole) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}
