import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" 
  ? "http://localhost:3000" 
  : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  socket: null,
  onlineUsers: [],

  // 检查登录状态
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      // 从 localStorage 读取 Token
      const token = localStorage.getItem("token");
      if (token) {
        setTimeout(() => get().connectSocket(), 500);
      } else {
        console.error("❌ No token in localStorage for checkAuth");
      }
    } catch (error) {
      console.log("Auth check error:", error);
      localStorage.removeItem("token");
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // 登录
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      
      // 直接从响应体中获取 Token，不再依赖 Cookie
      const token = res.data.token;
      if (token) {
        localStorage.setItem("token", token);
        console.log("✅ Token saved to localStorage from response body:", token);
        toast.success("Logged in successfully");
        get().connectSocket(); // 登录成功后立即连接 Socket
      } else {
        console.error("❌ No token found in response body");
        toast.error("Login failed: No token received");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Login failed!";
      toast.error(errorMsg);
      console.log("Login error:", error);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // 注册
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      
      // 直接从响应体中获取 Token
      const token = res.data.token;
      if (token) {
        localStorage.setItem("token", token);
        console.log("✅ Token saved to localStorage from response body:", token);
        toast.success("Account created successfully!");
        get().connectSocket();
      } else {
        console.error("❌ No token found in response body");
        toast.error("Signup failed: No token received");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Signup failed!";
      toast.error(errorMsg);
      console.log("Signup error:", error);
    } finally {
      set({ isSigningUp: false });
    }
  },

  // 登出
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.log("Logout API error:", error);
    } finally {
      localStorage.removeItem("token");
      set({ authUser: null });
      get().disconnectSocket();
      toast.success("Logged out successfully");
    }
  },

  // 更新资料
  updateProfile: async (data) => {
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Update failed!";
      toast.error(errorMsg);
      console.log("Update profile error:", error);
    }
  },

  // 连接 Socket
  connectSocket: () => {
    const { authUser } = get();
    
    if (!authUser || !authUser._id || get().socket?.connected) {
      console.log("Socket connection skipped: user not logged in or already connected");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No authentication token for chat");
      console.error("❌ No token in localStorage when connecting socket");
      return;
    }

    // 断开旧连接
    get().disconnectSocket();

    console.log("🔌 Connecting to socket with token:", token.substring(0, 20) + "...");

    const socket = io(BASE_URL, {
      withCredentials: true,
      auth: { token },
      query: { token },
      transports: ["polling"], // 强制轮询，避免 WebSocket 问题
      upgrade: false,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 30000,
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected successfully");
      toast.success("Chat connection established");
      socket.emit("join", { userId: authUser._id.toString() });
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err);
      toast.error(`Chat connection failed: ${err.message || "Authentication failed"}`);
      set({ socket: null });
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
      set({ socket: null });
      
      if (reason !== "io client disconnect") {
        toast.error("Chat connection lost, reconnecting...");
        setTimeout(() => {
          if (get().authUser) {
            get().connectSocket();
          }
        }, 3000);
      }
    });

    socket.on("getOnlineUsers", (userIds) => {
      console.log("🔄 Online users updated:", userIds);
      const validUserIds = Array.isArray(userIds) ? userIds : [];
      set({ onlineUsers: validUserIds });
    });

    socket.on("messageError", (msg) => {
      toast.error(msg);
    });

    set({ socket });
  },

  // 断开 Socket
  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      toast.info("Chat connection closed");
    }
    set({ socket: null, onlineUsers: [] });
  },

  // 重新连接
  reconnectSocket: () => {
    const toastId = toast.loading("Reconnecting to chat...");
    get().disconnectSocket();
    setTimeout(() => {
      get().connectSocket();
      toast.dismiss(toastId);
    }, 1000);
  },

  getUserId: () => {
    const { authUser } = get();
    return authUser?._id?.toString() || null;
  }
}));