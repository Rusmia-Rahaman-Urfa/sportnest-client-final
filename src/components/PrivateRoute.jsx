import { Navigate, useLocation } from "react-router-dom";
import { useSession } from "../lib/auth-client";
import LoadingSpinner from "./UI/LoadingSpinner";
const PrivateRoute = ({ children }) => {
  const { data: session, isPending } = useSession();
  const location = useLocation();
  if (isPending) return <LoadingSpinner />;
  if (!session)  return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
};
export default PrivateRoute;
