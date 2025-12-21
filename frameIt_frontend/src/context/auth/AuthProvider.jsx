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
  const [loading, setLoading] = useState(true);
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
      const data = await logOutUser();
      setUser(null);
      return data;
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
        setLoading(true);
        const data = await checkAuth();
        setUser(data);
        console.log("Auth check success: ", data);
      } catch (err) {
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          // not logged in
          setUser(null);
        } else if (status === 429) {
          console.warn("Too many requests: ", err);
        } else {
          console.warn("Auth check failed: ", err);
          setError(err.response?.data?.message || err.message);
        }
        console.log("Auth check failed: ", err);
      } finally {
        setLoading(false);
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
