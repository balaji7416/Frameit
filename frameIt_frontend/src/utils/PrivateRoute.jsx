import { Navigate } from "react-router";
import useAuth from "../context/auth/useAuth.js";
import Spinner from "../components/Spinner.jsx";
function PrivateRoute({ children }) {
  const { user, initialized } = useAuth();

  if (!initialized) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner type="md" />
      </div>
    );
  }

  return user ? children : <Navigate to="/auth" replace />;
}

export default PrivateRoute;
