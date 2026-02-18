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

// 增强响应拦截器：处理更多认证错误场景
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorStatus = error.response?.status;
    const errorMsg = error.response?.data?.message || "";
    
    // 处理401/Token过期/无效
    if (errorStatus === 401 || errorMsg.includes("Token") || errorMsg.includes("Unauthorized")) {
      localStorage.removeItem("token");
      
      // 避免重复跳转
      if (window.location.pathname !== "/login" && !window.location.pathname.includes("/signup")) {
        // 通知auth store执行登出
        if (window.useAuthStore) {
          window.useAuthStore.getState().logout();
        } else {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);