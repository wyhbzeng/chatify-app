import React from 'react';
import { Home, Database, BarChart3, Settings, User } from 'lucide-react';

const WeighingHeader = ({ userName }) => {
  return (
    <div className="bg-[#051020] border-b border-cyan-900/50 px-4 py-2 flex flex-col sm:flex-row justify-between items-center relative overflow-hidden">
      {/* 背景光效 */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/20 via-transparent to-cyan-900/20 animate-pulse pointer-events-none"></div>
      
      <div className="text-xl font-bold text-cyan-300 mb-2 sm:mb-0 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse">
        物联网称重交易管理系统
      </div>
      
      <div className="flex flex-wrap gap-3">
        <button className="relative flex items-center justify-center space-x-1 px-3 py-2 bg-cyan-900/40 rounded-full text-cyan-100 text-sm transition-all duration-500 hover:bg-cyan-700/70 hover:scale-105 hover:shadow-[0_0_25px_rgba(136,199,255,0.9)] active:scale-95 before:absolute before:inset-0 before:rounded-full before:shadow-[0_0_10px_rgba(136,199,255,0.8)] before:animate-pulse before:pointer-events-none">
          <Home size={16} />
          <span>首页</span>
        </button>
        <button className="relative flex items-center justify-center space-x-1 px-3 py-2 bg-cyan-900/40 rounded-full text-cyan-100 text-sm transition-all duration-500 hover:bg-cyan-700/70 hover:scale-105 hover:shadow-[0_0_25px_rgba(136,199,255,0.9)] active:scale-95 before:absolute before:inset-0 before:rounded-full before:shadow-[0_0_10px_rgba(136,199,255,0.8)] before:animate-pulse before:pointer-events-none">
          <Database size={16} />
          <span>数据维护</span>
        </button>
        <button className="relative flex items-center justify-center space-x-1 px-3 py-2 bg-cyan-900/40 rounded-full text-cyan-100 text-sm transition-all duration-500 hover:bg-cyan-700/70 hover:scale-105 hover:shadow-[0_0_25px_rgba(136,199,255,0.9)] active:scale-95 before:absolute before:inset-0 before:rounded-full before:shadow-[0_0_10px_rgba(136,199,255,0.8)] before:animate-pulse before:pointer-events-none">
          <BarChart3 size={16} />
          <span>统计查询</span>
        </button>
        <button className="relative flex items-center justify-center space-x-1 px-3 py-2 bg-cyan-900/40 rounded-full text-cyan-100 text-sm transition-all duration-500 hover:bg-cyan-700/70 hover:scale-105 hover:shadow-[0_0_25px_rgba(136,199,255,0.9)] active:scale-95 before:absolute before:inset-0 before:rounded-full before:shadow-[0_0_10px_rgba(136,199,255,0.8)] before:animate-pulse before:pointer-events-none">
          <Settings size={16} />
          <span>功能设置</span>
        </button>
        <span className="relative flex items-center justify-center space-x-1 px-3 py-2 text-cyan-400 text-sm bg-cyan-900/20 rounded-full">
          <User size={16} />
          <span>用户: {userName}</span>
        </span>
      </div>
    </div>
  );
};

export default WeighingHeader;