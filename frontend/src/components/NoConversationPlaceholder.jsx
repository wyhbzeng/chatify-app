import { MessageCircleIcon } from "lucide-react";

const NoConversationPlaceholder = () => {
  return (
    // 核心修改：
    // 1. 保留 h-full 确保撑满父容器
    // 2. 添加 bg-slate-900/50 匹配整体背景风格
    // 3. 微调间距让视觉更平衡
    <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-slate-900/50">
      <div className="size-20 bg-cyan-500/20 rounded-full flex items-center justify-center mb-6">
        <MessageCircleIcon className="size-10 text-cyan-400" />
      </div>
      <h3 className="text-xl font-semibold text-slate-200 mb-2">Select a conversation</h3>
      <p className="text-slate-400 max-w-md">
        Choose a contact from the sidebar to start chatting or continue a previous conversation.
      </p>
    </div>
  );
};

export default NoConversationPlaceholder;