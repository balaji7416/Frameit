import axios from "axios";

const baseURL =
  import.meta.env.VITE_ENV === "development"
    ? "http://localhost:3000/api"
    : import.meta.env.VITE_BASE_URL || "https://frameit-jnsz.onrender.com/api";

const api = axios.create({
  baseURL: baseURL,
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") ?? sessionStorage.getItem("token");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (
      err?.response?.status === 401 &&
      window.location.pathname !== "/login"
    ) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/";
    }
    return Promise.reject(err);
  },
);

export default api;
