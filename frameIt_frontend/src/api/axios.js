import axios from "axios";

const baseURL = "https://frameit-go92.onrender.com/api";

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((promise) => {
    if (error) promise.reject(error);
    else promise.resolve();
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If refresh itself failed → game over
    if (originalRequest.url.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    // f already retried once, don't loop
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // Only care about 401s
    if (error.response?.status === 401) {
      // If refresh already running → queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(api(originalRequest)),
            reject,
          });
        });
      }

      // Start refresh flow
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("refreshing token....");
        await api.post("/auth/refresh");
        processQueue(null);
        return api(originalRequest);
      } catch (err) {
        processQueue(err);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
