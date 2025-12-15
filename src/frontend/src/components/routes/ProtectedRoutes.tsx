import { useUser } from "../../contexts/UserContext";
import { Navigate, Outlet, useLocation } from "react-router";
import { generateInfoToast } from "../../utils/toastGenerator";

export default function ProtectedRoutes() {
  const { user, loading } = useUser();
  const location = useLocation();

  if (loading) {
    return <div className="flex justify-center py-10">Loading...</div>;
  }

  if (!user) {
    generateInfoToast("You must be logged in to enter this page");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
