import React from 'react';
// 导入图标（需先安装 lucide-react：npm install lucide-react）
import { Truck, Scale, Save, Printer, Trash2 } from 'lucide-react';

const WeighingActionButtons = ({ onHeavy, onEmpty, onSaveTare, onSave, onPrint, onClear }) => {
  return (
    <div className="flex flex-wrap gap-4">
      <button
        onClick={onHeavy}
        className="px-5 py-3 min-w-[110px] bg-gradient-to-r from-cyan-600 to-cyan-500 rounded-md
                 text-white font-semibold shadow-[0_0_10px_rgba(6,182,212,0.5)]
                 hover:shadow-[0_0_16px_rgba(6,182,212,0.7)] transition-all flex items-center justify-center"
      >
        <Truck className="w-4 h-4 mr-2" />
        重车(Z)
      </button>
      <button
        onClick={onEmpty}
        className="px-5 py-3 min-w-[110px] bg-gradient-to-r from-cyan-600 to-cyan-500 rounded-md
                 text-white font-semibold shadow-[0_0_10px_rgba(6,182,212,0.5)]
                 hover:shadow-[0_0_16px_rgba(6,182,212,0.7)] transition-all flex items-center justify-center"
      >
        <Truck className="w-4 h-4 mr-2" />
        空车(K)
      </button>
      <button
        onClick={onSaveTare}
        className="px-5 py-3 min-w-[110px] bg-gradient-to-r from-cyan-600 to-cyan-500 rounded-md
                 text-white font-semibold shadow-[0_0_10px_rgba(6,182,212,0.5)]
                 hover:shadow-[0_0_16px_rgba(6,182,212,0.7)] transition-all flex items-center justify-center"
      >
        <Scale className="w-4 h-4 mr-2" />
        存皮
      </button>
      <button
        onClick={onSave}
        className="px-5 py-3 min-w-[110px] bg-gradient-to-r from-cyan-600 to-cyan-500 rounded-md
                 text-white font-semibold shadow-[0_0_10px_rgba(6,182,212,0.5)]
                 hover:shadow-[0_0_16px_rgba(6,182,212,0.7)] transition-all flex items-center justify-center"
      >
        <Save className="w-4 h-4 mr-2" />
        保存(S)
      </button>
      <button
        onClick={onPrint}
        className="px-5 py-3 min-w-[110px] bg-gradient-to-r from-cyan-600 to-cyan-500 rounded-md
                 text-white font-semibold shadow-[0_0_10px_rgba(6,182,212,0.5)]
                 hover:shadow-[0_0_16px_rgba(6,182,212,0.7)] transition-all flex items-center justify-center"
      >
        <Printer className="w-4 h-4 mr-2" />
        打印(Y)
      </button>
      <button
        onClick={onClear}
        className="px-5 py-3 min-w-[110px] bg-gradient-to-r from-cyan-600 to-cyan-500 rounded-md
                 text-white font-semibold shadow-[0_0_10px_rgba(6,182,212,0.5)]
                 hover:shadow-[0_0_16px_rgba(6,182,212,0.7)] transition-all flex items-center justify-center"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        清空(C)
      </button>
    </div>
  );
};

export default WeighingActionButtons;