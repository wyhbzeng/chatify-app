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
    // 取消旧订阅
    get().unsubscribeFromMessages();
    set({ selectedUser, messages: [] });
    // 订阅新消息
    get().subscribeToMessages();
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

    // 乐观更新
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id.toString(),
      receiverId: selectedUser._id.toString(),
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };
    set({ messages: [...messages, optimisticMessage] });

    try {
      // 发送到后端
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      // 替换乐观消息
      set({
        messages: messages.map(msg => 
          msg._id === tempId ? res.data : msg
        ),
      });
    } catch (error) {
      // 回滚
      set({ messages: messages.filter(msg => msg._id !== tempId) });
      const errorMsg = error.response?.data?.message || "Failed to send message";
      toast.error(errorMsg);
      console.log("Send message error:", error);
    }
  },

  // 订阅新消息
  subscribeToMessages: () => {
    const { selectedUser, isSoundEnabled } = get();
    if (!selectedUser || !selectedUser._id) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) {
      console.warn("Socket not connected, cannot subscribe to messages");
      return;
    }

    // 移除旧监听
    socket.off("newMessage");

    // 监听新消息
    socket.on("newMessage", (newMessage) => {
      console.log("📥 Received new message:", newMessage);
      // 数据校验
      if (!newMessage || !newMessage.senderId || !newMessage.receiverId) {
        console.warn("Invalid message data:", newMessage);
        return;
      }

      // 只处理和当前聊天对象相关的消息
      if (
        newMessage.senderId === selectedUser._id.toString() ||
        newMessage.receiverId === selectedUser._id.toString()
      ) {
        const currentMessages = get().messages;
        // 避免重复
        const isDuplicate = currentMessages.some(msg => msg._id === newMessage._id);
        if (!isDuplicate) {
          set({ messages: [...currentMessages, newMessage] });
          
          // 播放提示音
          if (isSoundEnabled && newMessage.senderId === selectedUser._id.toString()) {
            try {
              const sound = new Audio("/sounds/notification.mp3");
              sound.currentTime = 0;
              sound.play().catch(e => console.log("Audio play error:", e));
            } catch (e) {
              console.log("Notification sound error:", e);
            }
          }
        }
      }
    });

    console.log("✅ Subscribed to new messages for user:", selectedUser._id);
  },

  // 取消订阅
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