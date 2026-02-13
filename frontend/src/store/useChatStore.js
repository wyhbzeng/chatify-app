import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

  toggleSound: () => {
    const newState = !get().isSoundEnabled;
    localStorage.setItem("isSoundEnabled", newState);
    set({ isSoundEnabled: newState });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),

  setSelectedUser: (selectedUser) => {
    get().unsubscribeFromMessages();
    set({ selectedUser, messages: [] });
    if (selectedUser && selectedUser._id) {
      get().getMessagesByUserId(selectedUser._id);
      get().subscribeToMessages();
    }
  },

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to load contacts";
      toast.error(errorMsg);
      console.log("Get contacts error:", error);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to load chats";
      toast.error(errorMsg);
      console.log("Get chats error:", error);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    if (!userId) {
      console.warn("Invalid user ID for messages");
      set({ isMessagesLoading: false });
      return;
    }
    
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      const formattedMessages = res.data.map(msg => ({
        ...msg,
        _id: msg._id.toString(),
        senderId: msg.senderId.toString(),
        receiverId: msg.receiverId.toString(),
      }));
      set({ messages: formattedMessages });
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to load messages";
      toast.error(errorMsg);
      console.log("Get messages error:", error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // 🔴 核心：强制立即显示，不依赖任何条件
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const { authUser, socket } = useAuthStore.getState();

    if (!selectedUser || !authUser) {
      toast.error("Please select a contact to chat");
      return;
    }
    if (!socket || !socket.connected) {
      toast.error("Chat connection lost, reconnecting...");
      useAuthStore.getState().reconnectSocket();
      return;
    }

    // 1. 立即在本地显示（强制添加到 messages 数组）
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id.toString(),
      receiverId: selectedUser._id.toString(),
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true, // 标记为临时消息
    };

    // 直接更新状态，强制渲染
    set((state) => ({
      messages: [...state.messages, optimisticMessage],
    }));

    try {
      // 2. 发送到后端
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);

      // 3. 用真实消息替换临时消息（按 tempId 匹配）
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === tempId ? res.data : msg
        ),
      }));
    } catch (error) {
      // 4. 出错时回滚，删除临时消息
      set((state) => ({
        messages: state.messages.filter((msg) => msg._id !== tempId),
      }));
      const errorMsg = error.response?.data?.message || "Failed to send message";
      toast.error(errorMsg);
      console.log("Send message error:", error);
    }
  },

  // 订阅新消息：只处理对方发来的，自己的已经在本地处理了
  subscribeToMessages: () => {
    const { selectedUser, isSoundEnabled } = get();
    const { authUser } = useAuthStore.getState();
    if (!selectedUser || !selectedUser._id || !authUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) {
      console.warn("Socket not connected, cannot subscribe to messages");
      return;
    }

    socket.off("newMessage");

    socket.on("newMessage", (newMessage) => {
      console.log("📥 Received new message:", newMessage);
      if (!newMessage || !newMessage.senderId || !newMessage.receiverId || !newMessage._id) {
        console.warn("Invalid message data:", newMessage);
        return;
      }

      // 只处理对方发来的消息，自己发的已经在本地处理了
      const isFromOtherUser = newMessage.senderId !== authUser._id.toString();
      const isForCurrentChat =
        newMessage.senderId === selectedUser._id.toString() ||
        newMessage.receiverId === selectedUser._id.toString();

      if (isFromOtherUser && isForCurrentChat) {
        set((state) => {
          // 检查是否重复
          const isDuplicate = state.messages.some((msg) => msg._id === newMessage._id);
          if (isDuplicate) {
            console.log("⚠️ Duplicate message filtered out:", newMessage._id);
            return state;
          }
          return { messages: [...state.messages, newMessage] };
        });

        // 播放提示音
        if (isSoundEnabled && newMessage.senderId === selectedUser._id.toString()) {
          try {
            new Audio("/sounds/notification.mp3").play().catch(() => {});
          } catch {}
        }
      }
    });

    console.log("✅ Subscribed to new messages for:", selectedUser._id);
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
      console.log("❌ Unsubscribed from new messages");
    }
  },

  isUserOnline: (userId) => {
    if (!userId) return false;
    const { onlineUsers } = useAuthStore.getState();
    return Array.isArray(onlineUsers) && onlineUsers.includes(userId.toString());
  },
}));