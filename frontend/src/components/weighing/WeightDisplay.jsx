import React from 'react';

const WeightDisplay = ({ weight, status }) => {
  return (
    <div className="flex flex-col items-center justify-center py-3">
      {/* 上渐变线：更长 + 更亮青色科技渐变 */}
      <div className="w-[280px] h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent mb-3"></div>

      <div className="text-4xl font-bold text-cyan-300 tracking-wider drop-shadow-[0_0_12px_rgba(34,211,238,0.9)]">
        {weight} <span className="text-2xl text-cyan-400">kg</span>
      </div>

      <div className="flex items-center gap-3 mt-1">
        <span className="flex items-center gap-1 text-red-400 text-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
          {status?.stable ? '稳定' : '不稳定'}
        </span>
        <span className="flex items-center gap-1 text-cyan-400 text-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          {status?.transmitting ? '传输中' : '未传输'}
        </span>
      </div>

      {/* 下渐变线：更长 + 更亮青色科技渐变 */}
      <div className="w-[280px] h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent mt-3"></div>
    </div>
  );
};

export default WeightDisplay;