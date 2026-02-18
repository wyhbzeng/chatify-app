import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  token: localStorage.getItem("token") || null,
  socket: null,
  onlineUsers: [],
  isLoading: false,
  error: null,

  // 初始化Socket连接
  initSocket: () => {
    const { token, socket } = get();
    if (socket) return socket;
    
    if (!token) {
      get().logout();
      return null;
    }

    // 构建Socket连接URL
    const baseUrl = import.meta.env.MODE === "development" 
      ? `${window.location.protocol}//${window.location.hostname}:3000` 
      : "";

    const newSocket = io(baseUrl, {
      transports: ["polling"],
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // 监听连接成功
    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);
    });

    // 监听在线用户
    newSocket.on("getOnlineUsers", (users) => {
      set({ onlineUsers: users });
    });

    // 监听连接错误
    newSocket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
      if (err.message.includes("Token")) {
        get().logout();
        toast.error("登录已过期，请重新登录");
      }
    });

    // 监听断开连接
    newSocket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
      // 如果是服务器主动断开或认证失败，执行登出
      if (reason === "io server disconnect" || reason === "transport error") {
        get().logout();
      }
    });

    set({ socket: newSocket });
    return newSocket;
  },

  // 重新连接Socket
  reconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
    }
    set({ socket: null });
    get().initSocket();
  },

  // 注册
  signup: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.post("/auth/signup", userData);
      const { token, ...user } = res.data;
      
      localStorage.setItem("token", token);
      set({ authUser: user, token, isLoading: false });
      
      // 初始化Socket
      get().initSocket();
      
      toast.success("注册成功");
      return user;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "注册失败";
      set({ error: errorMsg, isLoading: false });
      toast.error(errorMsg);
      throw error;
    }
  },

  // 登录
  login: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.post("/auth/login", userData);
      const { token, ...user } = res.data;
      
      localStorage.setItem("token", token);
      set({ authUser: user, token, isLoading: false });
      
      // 初始化Socket（会自动断开旧连接）
      get().initSocket();
      
      toast.success("登录成功");
      return user;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "登录失败";
      set({ error: errorMsg, isLoading: false });
      toast.error(errorMsg);
      throw error;
    }
  },

  // 增强版登出：彻底清理所有状态
  logout: async () => {
    try {
      // 先调用后端logout接口
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.log("Logout API error:", error);
    } finally {
      // 强制清理本地状态
      const { socket } = get();
      if (socket) {
        socket.disconnect(); // 断开Socket
        console.log("🔌 Socket disconnected on logout");
      }
      
      // 清除本地存储
      localStorage.removeItem("token");
      
      // 重置状态
      set({ 
        authUser: null, 
        token: null, 
        socket: null, 
        onlineUsers: [],
        isLoading: false,
        error: null 
      });
      
      toast.success("登出成功");
      
      // 跳转到登录页
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
  },

  // 检查登录状态
  checkAuth: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      get().logout();
      return false;
    }

    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data, token, isLoading: false });
      // 初始化Socket
      get().initSocket();
      return true;
    } catch (error) {
      get().logout();
      return false;
    }
  },

  // 更新用户资料
  updateProfile: async (formData) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", formData);
      set({ authUser: res.data, isLoading: false });
      toast.success("资料更新成功");
      return res.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "更新失败";
      set({ error: errorMsg, isLoading: false });
      toast.error(errorMsg);
      throw error;
    }
  },
}));