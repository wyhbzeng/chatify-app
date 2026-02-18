import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

// 开发阶段适配IP访问：和你原有代码完全一致
const getDynamicSocketUrl = () => {
  if (import.meta.env.MODE === "development") {
    const protocol = window.location.protocol;
    const host = window.location.hostname;
    return `${protocol}//${host}:3000`;
  }
  return "/";
};

const BASE_URL = getDynamicSocketUrl();

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  socket: null,
  onlineUsers: [],

  // 回退：移除超时和延迟，恢复你原有checkAuth逻辑（仅保留token校验）
  checkAuth: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        set({ authUser: null });
        return;
      }
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Auth check error:", error);
      localStorage.removeItem("token");
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // 完全恢复你原有登录逻辑
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      
      const token = res.data.token;
      if (token) {
        localStorage.setItem("token", token);
        console.log("✅ Token saved to localStorage:", token.substring(0, 20) + "...");
        toast.success("Logged in successfully");
        await get().checkAuth(); // 恢复原有checkAuth调用
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

  // 完全恢复你原有注册逻辑
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      
      const token = res.data.token;
      if (token) {
        localStorage.setItem("token", token);
        console.log("✅ Token saved to localStorage:", token.substring(0, 20) + "...");
        toast.success("Account created successfully!");
        await get().checkAuth(); // 恢复原有checkAuth调用
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

  // 完全恢复你原有登出逻辑
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

  // 完全恢复你原有更新资料逻辑
  updateProfile: async (formData) => {
    try {
      const res = await axiosInstance.put(
        "/auth/update-profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
      return res.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Update failed!";
      toast.error(errorMsg);
      console.log("Update profile error:", error);
      throw error;
    }
  },

  // 核心修复：仅优化Socket连接的transports，恢复你原有逻辑
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

    get().disconnectSocket();

    console.log("🔌 Connecting to socket with token:", token.substring(0, 20) + "...");

    // 仅保留transports修复，其余参数完全恢复你原有逻辑
    const socket = io(BASE_URL, {
      withCredentials: true,
      auth: { token },
      transports: ["polling"], // 恢复你原有配置，避免websocket兼容问题
      upgrade: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
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
        toast.error("Chat connection lost");
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

  // 完全恢复你原有断开Socket逻辑
  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      toast.info("Chat connection closed");
    }
    set({ socket: null, onlineUsers: [] });
  },

  // 完全恢复你原有重新连接逻辑
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