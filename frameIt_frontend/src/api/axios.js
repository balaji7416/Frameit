import axios from "axios";

const baseURL = "https://frameit-go92.onrender.com/api";
const api = axios.create({
  baseURL: baseURL || "http://localhost:3000/api",
  withCredentials: true,
});

const max_tries = 2;

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original_request = err.config;

    if (original_request.url.includes("/auth/refresh")) {
      return Promise.reject(err);
    }

    original_request._retryCount = original_request._retryCount || 0;

    if (
      err.response?.status === 401 &&
      original_request._retryCount < max_tries
    ) {
      original_request._retryCount += 1;
      try {
        await api.post("/auth/refresh");
        return api(original_request);
      } catch (refresh_err) {
        return Promise.reject(refresh_err);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
