// frontend/src/components/weighing/BottomActionBar.jsx
import React from 'react';
import { Image, Columns, Download, Printer, RefreshCw } from 'lucide-react';

const BottomActionBar = ({ onRefresh }) => {
  return (
    <div className="flex items-center justify-between px-3 py-2 bg-[#0a1a2f]/60 border-t border-cyan-900/60">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-cyan-300 text-sm">时间</label>
          <select className="bg-[#0a1a2f]/80 border border-cyan-900/50 text-cyan-200 px-2 py-1 rounded text-sm focus:border-cyan-400 focus:outline-none">
            <option>请选择</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-cyan-300 text-sm">记录类型</label>
          <select className="bg-[#0a1a2f]/80 border border-cyan-900/50 text-cyan-200 px-2 py-1 rounded text-sm focus:border-cyan-400 focus:outline-none">
            <option>请选择</option>
          </select>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={onRefresh}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0a2a4a] border border-cyan-500/50 rounded text-cyan-100 hover:border-cyan-400 hover:shadow-[0_0_8px_rgba(34,211,238,0.4)] transition-all"
          disabled={!onRefresh}
        >
          <RefreshCw size={14} />
          <span>刷新</span>
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0a2a4a] border border-cyan-500/50 rounded text-cyan-100 hover:border-cyan-400 hover:shadow-[0_0_8px_rgba(34,211,238,0.4)] transition-all">
          <Image size={14} />
          <span>过磅图片</span>
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0a2a4a] border border-cyan-500/50 rounded text-cyan-100 hover:border-cyan-400 hover:shadow-[0_0_8px_rgba(34,211,238,0.4)] transition-all">
          <Columns size={14} />
          <span>显示字段</span>
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0a2a4a] border border-cyan-500/50 rounded text-cyan-100 hover:border-cyan-400 hover:shadow-[0_0_8px_rgba(34,211,238,0.4)] transition-all">
          <Download size={14} />
          <span>数据导出</span>
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0a2a4a] border border-cyan-500/50 rounded text-cyan-100 hover:border-cyan-400 hover:shadow-[0_0_8px_rgba(34,211,238,0.4)] transition-all">
          <Printer size={14} />
          <span>打印报表</span>
        </button>
      </div>
    </div>
  );
};

export default BottomActionBar;