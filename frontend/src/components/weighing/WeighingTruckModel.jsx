import React from 'react';
// 确保图片路径正确，可替换为你的全息卡车图
import truckHologram from '../../../public/images/truck-hologram.png';

const WeighingTruckModel = () => {
  return (
    <div className="relative w-[450px] h-[400px] flex items-center justify-center">
      <img
        src={truckHologram}
        alt="全息卡车模型"
        className="w-full h-auto object-contain
                 filter drop-shadow-[0_0_20px_rgba(6,182,212,0.8)]"
      />
      <div className="absolute bottom-6 px-4 py-2 bg-[#051a3a]/80 border border-cyan-600/50 rounded-md
                    text-sm text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.5)] backdrop-blur-sm">
        称重系统
      </div>
    </div>
  );
};

export default WeighingTruckModel;