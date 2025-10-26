import axios from "axios";

// API para autenticación
export const AuthAPI = axios.create({
  baseURL: "http://localhost:8080/api/auth"
});

// API para balance (nueva)
export const BalanceAPI = axios.create({
  baseURL: "http://localhost:8080/api/balance"
});

// API para upload de archivos
export const UploadAPI = axios.create({
  baseURL: "http://localhost:8080/api/upload"
});

// Interceptor para agregar token automáticamente
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

// Interceptor para UploadAPI también
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