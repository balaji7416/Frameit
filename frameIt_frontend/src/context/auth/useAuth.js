import { useContext } from "react";
import AuthContext from "./AuthContext.js";

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("Authcontext should be used with a Authprovider");
  }
  return context;
}

export default useAuth;
