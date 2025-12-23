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
      setError(null);
      const { refreshToken, accessToken, user } = await registerUser(
        username,
        email,
        password,
        rememberMe
      );

      // set the tokens in local / session storage
      if (rememberMe && accessToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        sessionStorage.setItem("accessToken", accessToken);
        sessionStorage.setItem("user", JSON.stringify(user));
      }

      setUser(user);
      return user;
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
      setError;
      const { refreshToken, accessToken, user } = await loginUser(
        email,
        password,
        rememberMe
      );

      // set the tokens in local / session storage
      if (rememberMe && accessToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        sessionStorage.setItem("accessToken", accessToken);
        sessionStorage.setItem("user", JSON.stringify(user));
      }

      setUser(user);
      return user;
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
      setError(null);

      // remove the token from local storage
      localStorage.clear();
      sessionStorage.clear();

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

        const data = checkAuth();
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
