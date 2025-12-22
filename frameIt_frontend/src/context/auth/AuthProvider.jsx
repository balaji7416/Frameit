import AuthContext from "./AuthContext.js";
import { useEffect, useState } from "react";
import {
  registerUser,
  loginUser,
  logOutUser,
  checkAuth,
} from "../../services/auth.service.js";
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  const register = async (username, email, password, rememberMe) => {
    try {
      setLoading(true);
      const data = await registerUser(username, email, password, rememberMe);
      setUser(data);
      return data;
    } catch (err) {
      console.log("Register Failed: ", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, rememberMe) => {
    try {
      setLoading(true);
      const data = await loginUser(email, password, rememberMe);
      setUser(data);
      return data;
    } catch (err) {
      console.log("Login Failed: ", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await logOutUser();
      setUser(null);
    } catch (err) {
      console.log("Logout Failed: ", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const authInit = async () => {
      try {
        console.log("Checking auth...");

        const data = await checkAuth();
        setUser(data);
        console.log("Auth check success: ", data);
      } catch (err) {
        setUser(null);
        console.log("Auth check failed: ", err);
      } finally {
        setInitialized(true);
      }
    };
    authInit();
  }, []);

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    initialized,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
