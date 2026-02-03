import { Navigate } from "react-router";
import useAuth from "../context/auth/useAuth.js";
import Spinner from "../components/Spinner.jsx";
function PrivateRoute({ children }) {
  const { user, authInitialized } = useAuth();

  if (!authInitialized) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner type="md" />
      </div>
    );
  }

  if (user) {
    return children;
  } else {
    console.log("auth failed from PrivateRoute: redirect to login");
    <Navigate to="/auth" replace />;
  }
}

export default PrivateRoute;
