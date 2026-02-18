import axios from "axios";

// 完全恢复你原有动态URL逻辑
const getDynamicBaseUrl = () => {
  if (import.meta.env.MODE === "development") {
    const protocol = window.location.protocol;
    const host = window.location.hostname;
    return `${protocol}//${host}:3000/api`;
  }
  return "/api";
};

const BASE_URL = getDynamicBaseUrl();

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

// 完全恢复你原有请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 简化响应拦截器：仅保留401处理，移除复杂逻辑
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login" && !window.location.pathname.includes("/signup")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);