import { XIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const isOnline = selectedUser?._id 
    ? onlineUsers.includes(selectedUser._id.toString()) 
    : false;

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  if (!selectedUser) return null;

  return (
    <div
      className={`flex justify-between items-center bg-slate-800/50 border-b
      border-slate-700/50 h-[84px] px-6 shrink-0 ${isMobile ? 'hidden' : 'flex'}`}
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img 
              src={selectedUser.profilePic || "/avatar.png"} 
              alt={selectedUser.fullName} 
              className="w-full h-full object-cover"
            />
          </div>
          <span 
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-800 ${
              isOnline ? "bg-green-500" : "bg-slate-600"
            }`}
          />
        </div>

        <div>
          <h3 className="text-slate-200 font-medium">{selectedUser.fullName}</h3>
          <p className="text-slate-400 text-sm">
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {!isMobile && (
        <button 
          onClick={() => setSelectedUser(null)}
          aria-label="Close chat"
          className="hover:bg-slate-700/50 p-1 rounded-full transition-colors"
        >
          <XIcon className="w-5 h-5 text-slate-400 hover:text-slate-200 transition-colors" />
        </button>
      )}
    </div>
  );
}

export default ChatHeader;