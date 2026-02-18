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
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="relative w-full min-h-screen h-screen overflow-hidden bg-transparent">
      <div className="absolute inset-0 p-4 md:p-6 flex items-center justify-center">
        <BorderAnimatedContainer className="w-full max-w-6xl h-full max-h-[800px]">
          <div className="flex flex-col md:flex-row h-full w-full overflow-hidden">
            <div 
              className={`
                w-full md:w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col shrink-0
                ${isMobile && selectedUser ? 'hidden' : 'flex'}
              `}
            >
              <ProfileHeader />
              <ActiveTabSwitch />
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {activeTab === "chats" ? <ChatsList /> : <ContactList />}
              </div>
            </div>

            <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm h-full overflow-hidden">
              {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
}

export default ChatPage;