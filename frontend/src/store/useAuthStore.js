import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

// 开发阶段适配IP访问：优先用动态IP，兼容localhost和手机IP访问
const getDynamicSocketUrl = () => {
  // 开发环境下，自动获取当前访问的主机（localhost/192.168.1.76等）
  if (import.meta.env.MODE === "development") {
    const protocol = window.location.protocol;
    const host = window.location.hostname;
    return `${protocol}//${host}:3000`;
  }
  // 生产环境保持原有逻辑
  return "/";
};

// 替换原有硬编码的BASE_URL，其余逻辑完全不变
const BASE_URL = getDynamicSocketUrl();

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  socket: null,
  onlineUsers: [],

  // 修复checkAuth：先挂载token再请求
  checkAuth: async () => {
    try {
      const token = localStorage.getItem("token");
      // 先判断是否有token，没有直接重置状态
      if (!token) {
        set({ authUser: null });
        return;
      }
      // 确保token挂载到请求头后再请求
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket(); // 校验成功后连接Socket
    } catch (error) {
      console.log("Auth check error:", error);
      localStorage.removeItem("token");
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // 登录（逻辑不变，保留）
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      
      // 直接从响应体中获取 Token
      const token = res.data.token;
      if (token) {
        localStorage.setItem("token", token);
        console.log("✅ Token saved to localStorage:", token.substring(0, 20) + "...");
        toast.success("Logged in successfully");
        // 登录成功后立即校验+连接Socket
        await get().checkAuth();
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

  // 注册（逻辑不变，保留）
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
        await get().checkAuth();
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

  // 登出（逻辑不变，保留）
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

  // 更新资料（保留，文件上传逻辑正确）
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

  // 简化Socket连接逻辑，避免重复连接
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
      transports: ["polling"],
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

  // 断开Socket（保留）
  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      toast.info("Chat connection closed");
    }
    set({ socket: null, onlineUsers: [] });
  },

  // 重新连接（保留）
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