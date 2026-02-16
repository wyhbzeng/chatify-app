import axios from "axios";

// 开发阶段适配IP访问：优先用动态IP，兼容localhost和手机IP访问
const getDynamicBaseUrl = () => {
  // 开发环境下，自动获取当前访问的主机（localhost/192.168.1.76等）
  if (import.meta.env.MODE === "development") {
    const protocol = window.location.protocol;
    const host = window.location.hostname;
    return `${protocol}//${host}:3000/api`;
  }
  // 生产环境保持原有逻辑
  return "/api";
};

// 替换原有硬编码的BASE_URL，其余逻辑完全不变
const BASE_URL = getDynamicBaseUrl();

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

// 请求拦截器：只挂载token，不做多余操作
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // 文件上传时自动覆盖Content-Type，避免手动设置出错
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器：只处理401，不做多余操作
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