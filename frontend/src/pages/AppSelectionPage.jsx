import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

function AppSelectionPage() {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-900 relative overflow-hidden">
      {/* 背景网格与渐变（复用项目原有风格） */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[100px]" />
      <div className="absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px]" />

      {/* 欢迎区域 */}
      <div className="text-center mb-12 z-10">
        <h1 className="text-4xl font-bold text-white mb-2">
          欢迎回来，{authUser?.fullName || '用户'}
        </h1>
        <p className="text-slate-400 text-lg">请选择您要使用的应用系统</p>
      </div>

      {/* 应用卡片容器 */}
      <div className="flex gap-8 z-10">
        {/* 聊天系统卡片 */}
        <div
          onClick={() => navigate('/chat')}
          className="w-64 p-8 bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-slate-700/60 hover:border-cyan-400"
        >
          <div className="text-5xl mb-4 text-center">💬</div>
          <h2 className="text-xl font-semibold text-center text-white mb-2">聊天系统</h2>
          <p className="text-slate-400 text-center text-sm">与联系人实时沟通</p>
        </div>

        {/* 物联网称重系统卡片 */}
        <div
          onClick={() => navigate('/weighing')}
          className="w-64 p-8 bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-slate-700/60 hover:border-cyan-400"
        >
          <div className="text-5xl mb-4 text-center">⚖️</div>
          <h2 className="text-xl font-semibold text-center text-white mb-2">物联网称重系统</h2>
          <p className="text-slate-400 text-center text-sm">物联网称重交易管理</p>
        </div>
      </div>
    </div>
  );
}

export default AppSelectionPage;