
import axios from "axios";

// auth API
export const AuthAPI = axios.create({
  baseURL: "http://localhost:8080/api/auth"
});

export const BalanceAPI = axios.create({
  baseURL: "http://localhost:8080/api/balance"
});

export const UploadAPI = axios.create({
  baseURL: "http://localhost:8080/api/upload"
});

BalanceAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

UploadAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);