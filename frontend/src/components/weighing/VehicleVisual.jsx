// VehicleVisual.jsx
import React from 'react';

const VehicleVisual = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* 全息外框 */}
      <div className="absolute inset-0 border border-cyan-400/30 rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.2)]"></div>
      {/* 全息扫描线动画 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/8 to-transparent animate-[scan_2.5s_ease-in-out_infinite]"></div>
      {/* 车辆模型 */}
      <div className="relative z-10 w-[90%] h-[90%]">
        <img
          src="/images/truck-hologram.png" // 替换为你的车辆模型图
          alt="车辆全息模型"
          className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]"
        />
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-[#0a1a2f]/70 text-cyan-300 text-[10px] px-1.5 py-0.5 rounded border border-cyan-400/30">
          车辆全息模型
        </div>
      </div>
    </div>
  );
};

export default VehicleVisual;