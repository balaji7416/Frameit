import AuthContext from "./AuthContext.js";
import { useEffect, useState } from "react";
import {
  registerUser,
  loginUser,
  checkAuth,
} from "../../services/auth.service.js";

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  const register = async (username, email, password, rememberMe) => {
    try {
      setAuthLoading(true);
      setAuthError(null);
      const { accessToken: token, user } = await registerUser(
        username,
        email,
        password,
        rememberMe,
      );

      // set the tokens in local / session storage
      if (rememberMe && token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(user));
      }

      setUser(user);
      return user;
    } catch (err) {
      console.log("Register Failed: ", err);
      setAuthError(err);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const login = async (email, password, rememberMe) => {
    try {
      setAuthLoading(true);
      setAuthError;
      const { accessToken: token, user } = await loginUser(
        email,
        password,
        rememberMe,
      );

      // set the tokens in local / session storage
      if (rememberMe && token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(user));
      }

      setUser(user);
      return user;
    } catch (err) {
      console.log("Login Failed: ", err);
      setAuthError(err);
      throw err;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      setAuthLoading(true);
      setAuthError(null);

      // remove the token from local/session storage
      localStorage.clear();
      sessionStorage.clear();

      setUser(null);
    } catch (err) {
      console.log("Logout Failed: ", err);
      setAuthError(err);
      throw err;
    } finally {
      setAuthLoading(false);
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
        setAuthInitialized(true);
      }
    };
    authInit();
  }, []);

  const value = {
    user,
    authLoading,
    authError,
    authInitialized,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
