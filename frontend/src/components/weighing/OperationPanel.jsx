import React from 'react';
import { Printer, Truck, Save, RefreshCw, Maximize2, Minimize2, FileText } from 'lucide-react';

const OperationPanel = ({
  onHeavyTruck,
  onEmptyTruck,
  onSaveTare,
  onSave,
  onPrint,
  onClear,
  onFullscreen,
  isFullscreen
}) => {
  const handleClick = (e, onClick) => {
    e.stopPropagation();
    e.preventDefault();
    onClick?.();
  };

  const buttons = [
    { icon: <Truck size={14} />, label: '重车(Z)', onClick: onHeavyTruck },
    { icon: <Truck size={14} />, label: '空车(K)', onClick: onEmptyTruck },
    { icon: <FileText size={14} />, label: '存皮', onClick: onSaveTare },
    { icon: <Save size={14} />, label: '保存(S)', onClick: onSave },
    { icon: <Printer size={14} />, label: '打印(V)', onClick: onPrint },
    { icon: <RefreshCw size={14} />, label: '清空(C)', onClick: onClear },
    {
      icon: isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />,
      label: isFullscreen ? '退出全屏' : '全屏',
      onClick: onFullscreen,
      className: 'bg-purple-700/50 text-cyan-100 hover:bg-purple-600/70 hover:shadow-[0_0_25px_rgba(209,180,255,0.9)] before:shadow-[0_0_10px_rgba(209,180,255,0.8)]'
    }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {buttons.map((btn, idx) => (
        <button
          key={idx}
          onClick={(e) => handleClick(e, btn.onClick)}
          className={`relative flex items-center justify-center space-x-1 px-2 py-1.5
           ${btn.className || 'bg-cyan-900/40 text-cyan-100 hover:bg-cyan-700/70 hover:shadow-[0_0_25px_rgba(136,199,255,0.9)]'}
            rounded-full text-xs h-8 transition-all duration-500 hover:scale-105 active:scale-95
            before:absolute before:inset-0 before:rounded-full before:shadow-[0_0_10px_rgba(136,199,255,0.8)] before:animate-pulse before:pointer-events-none`}
        >
          {btn.icon}
          <span>{btn.label}</span>
        </button>
      ))}
    </div>
  );
};

export default OperationPanel;