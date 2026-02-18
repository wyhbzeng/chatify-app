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

  // 关键修复：没有选中用户时直接返回 null，让 ChatPage 的 NoConversationPlaceholder 接管
  if (!selectedUser) {
    return null;
  }

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* 顶部Header：固定高度，不滚动 */}
      <div className="shrink-0">
        {!isMobile ? (
          <ChatHeader />
        ) : (
          <div className="bg-slate-800/50 border-b border-slate-700/50 px-4 py-3 flex items-center gap-3">
            <button 
              onClick={() => useChatStore.getState().setSelectedUser(null)}
              className="text-cyan-400 flex items-center gap-1 hover:text-cyan-300 transition-colors"
            >
              <span className="text-xl">←</span>
              <span className="text-sm font-medium">Back</span>
            </button>
            <div className="flex items-center gap-2 flex-1">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-600">
                <img 
                  src={selectedUser.profilePic || "/avatar.png"} 
                  alt={selectedUser.fullName} 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-slate-200 font-medium text-sm truncate">{selectedUser.fullName}</span>
            </div>
          </div>
        )}
      </div>
      
      {/* 中间消息列表：flex-1 占满剩余空间，overflow-y-auto 实现滚动 */}
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

      {/* 底部输入框：shrink-0 固定在底部，始终可见 */}
      {authUser && (
        <div className="shrink-0">
          <MessageInput />
        </div>
      )}
    </div>
  );
}

export default ChatContainer;