import React from 'react';

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
  const buttons = [
    { label: '重车(Z)', icon: '🚛', onClick: onHeavyTruck, className: 'bg-cyan-900/40 text-cyan-100' },
    { label: '空车(K)', icon: '🚚', onClick: onEmptyTruck, className: 'bg-cyan-900/40 text-cyan-100' },
    { label: '存皮', icon: '💾', onClick: onSaveTare, className: 'bg-cyan-900/40 text-cyan-100' },
    { label: '保存(S)', icon: '✅', onClick: onSave, className: 'bg-green-900/40 text-green-100' },
    { label: '打印(V)', icon: '🖨️', onClick: onPrint, className: 'bg-cyan-900/40 text-cyan-100' },
    { label: '清空(C)', icon: '🗑️', onClick: onClear, className: 'bg-orange-900/40 text-orange-100' },
    {
      label: isFullscreen ? '退出全屏' : '全屏',
      icon: isFullscreen ? '📺' : '⛶',
      onClick: onFullscreen,
      className: 'bg-purple-900/40 text-purple-100'
    }
  ];

  const handleClick = (e, onClick) => {
    e.preventDefault();
    onClick?.();
  };

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {buttons.map((btn, idx) => (
        <button
          key={idx}
          onClick={(e) => handleClick(e, btn.onClick)}
          className={`relative flex items-center justify-center space-x-2 px-3 py-2
           ${btn.className || 'bg-cyan-900/40 text-cyan-100 hover:bg-cyan-700/70 hover:shadow-[0_0_25px_rgba(136,199,255,0.9)]'}
            rounded-full text-sm h-9 transition-all duration-500 hover:scale-105 active:scale-95
            before:absolute before:inset-0 before:rounded-full before:shadow-[0_0_10px_rgba(136,199,255,0.8)] before:animate-pulse before:pointer-events-none`}
        >
          <span>{btn.icon}</span>
          <span>{btn.label}</span>
        </button>
      ))}
    </div>
  );
};

export default OperationPanel;