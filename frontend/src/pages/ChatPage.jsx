import { useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";

import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";

function ChatPage() {
  const { activeTab, selectedUser, setSelectedUser } = useChatStore();

  // 移动端检测
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 返回聊天列表
  const handleBack = () => setSelectedUser(null);

  return (
    <div className="relative w-full h-full min-h-screen md:max-w-6xl md:h-[800px] mx-auto">
      <BorderAnimatedContainer>
        <div className="flex flex-col md:flex-row h-full w-full">
          {/* 左侧栏：移动端选中聊天后隐藏，自适应高度 */}
          <div 
            className={`
              w-full md:w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col shrink-0
              ${isMobile && selectedUser ? 'hidden' : 'block'}
            `}
          >
            <ProfileHeader />
            <ActiveTabSwitch />
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {activeTab === "chats" ? <ChatsList /> : <ContactList />}
            </div>
          </div>

          {/* 右侧聊天区：自适应高度，不挤压内容 */}
          <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm h-full">
            {/* 移动端返回按钮：固定顶部，不被遮挡 */}
            {isMobile && selectedUser && (
              <div className="bg-slate-800/50 border-b border-slate-700/50 px-4 py-3 flex items-center gap-3 shrink-0 z-10">
                <button 
                  onClick={handleBack}
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
            
            {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
          </div>
        </div>
      </BorderAnimatedContainer>
    </div>
  );
}

export default ChatPage;