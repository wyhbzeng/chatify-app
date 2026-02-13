import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";

function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser, socket } = useAuthStore();
  const messageEndRef = useRef(null);

  // 加载消息
  useEffect(() => {
    if (!selectedUser || !selectedUser._id || !authUser) return;
    
    // 获取消息
    getMessagesByUserId(selectedUser._id);
    
    // 订阅消息
    const subscribe = () => {
      if (socket) {
        subscribeToMessages();
      }
    };
    
    subscribe();
    
    // 监听 Socket 连接状态
    if (socket) {
      socket.on("connect", subscribe);
    }

    return () => {
      unsubscribeFromMessages();
      if (socket) {
        socket.off("connect", subscribe);
      }
    };
  }, [selectedUser?._id, authUser?._id, socket]);

  // 自动滚动
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!selectedUser) {
    return (
      <div className="flex flex-col h-full bg-slate-900">
        <div className="flex-1 flex items-center justify-center text-slate-400">
          <p>Please select a contact to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-900">
      <ChatHeader />
      <div className="flex-1 px-6 overflow-y-auto py-8">
        {isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : messages.length > 0 ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg._id || msg.tempId}
                className={`chat ${msg.senderId === authUser._id.toString() ? "chat-end" : "chat-start"}`}
              >
                <div
                  className={`chat-bubble relative ${
                    msg.senderId === authUser._id.toString()
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-800 text-slate-200"
                  } ${msg.isOptimistic ? "opacity-70 animate-pulse" : ""}`}
                >
                  {msg.image && (
                    <img 
                      src={msg.image} 
                      alt="Shared image" 
                      className="rounded-lg h-48 w-full object-cover"
                      loading="lazy"
                    />
                  )}
                  {msg.text && <p className="mt-2">{msg.text}</p>}
                  <p className="text-xs mt-1 opacity-75 flex items-center gap-1 justify-end">
                    {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {msg.isOptimistic && <span>Sending...</span>}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>

      {authUser && <MessageInput />}
    </div>
  );
}

export default ChatContainer;