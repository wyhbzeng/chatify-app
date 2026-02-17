import { useEffect, useRef, useState } from "react";
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!selectedUser || !selectedUser._id || !authUser) return;
    
    getMessagesByUserId(selectedUser._id);
    
    const subscribe = () => {
      if (socket) {
        subscribeToMessages();
      }
    };
    
    subscribe();
    
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

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
      {/* 移动端隐藏ChatHeader，避免和返回栏重复 */}
      {!isMobile && <ChatHeader />}
      
      {/* 消息容器：自适应高度，底部留动态空间 */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-8">
        {isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : messages.length > 0 ? (
          <div className="max-w-[90%] md:max-w-3xl mx-auto space-y-6">
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
                      className="rounded-lg h-32 md:h-48 w-full object-cover"
                      loading="lazy"
                    />
                  )}
                  {msg.text && <p className="mt-2 text-sm md:text-base">{msg.text}</p>}
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

      {/* 输入框：自然在底部，不挤压内容 */}
      {authUser && (
        <div className="shrink-0">
          <MessageInput />
        </div>
      )}
    </div>
  );
}

export default ChatContainer;