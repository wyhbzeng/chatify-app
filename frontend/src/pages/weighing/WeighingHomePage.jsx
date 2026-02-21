import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// 移除了 Maximize2, Minimize2 的导入，因为现在在子组件中使用

// 导入子组件
import WeighingTopNav from '../../components/weighing/WeighingTopNav';
import WeighingStatusLights from '../../components/weighing/WeighingStatusLights';
import WeighingDisplay from '../../components/weighing/WeighingDisplay';
import WeighingTruckModel from '../../components/weighing/WeighingTruckModel';
import WeighingForm from '../../components/weighing/WeighingForm';
import WeighingActionButtons from '../../components/weighing/WeighingActionButtons';
import WeighingRecordsTable from '../../components/weighing/WeighingRecordsTable';

const WeighingHomePage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    grossWeight: 0,
    tareWeight: 0,
    netWeight: 0,
    actualWeight: 0,
    vehicleNo: '',
    goodsName: '',
    specification: '',
    senderUnit: '',
    receiverUnit: '',
    amount: 0,
    remark: '',
  });

  // 全屏功能相关代码（保留状态和逻辑，仅移除页面上的独立按钮）
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('全屏切换失败:', err);
    }
  };

  // 操作按钮回调
  const handleHeavy = () => { /* 重车逻辑 */ };
  const handleEmpty = () => { /* 空车逻辑 */ };
  const handleSaveTare = () => { /* 存皮逻辑 */ };
  const handleSave = () => { /* 保存逻辑 */ };
  const handlePrint = () => { /* 打印逻辑 */ };
  const handleClear = () => { setForm({ /* 重置表单 */ }); };

  const cardStyle = "bg-gradient-to-br from-cyan-900/40 to-cyan-800/20 border border-cyan-700/50 rounded-xl shadow-lg shadow-cyan-900/20 p-6";

  return (
    <div ref={containerRef} className="min-h-screen w-full bg-[#051020] text-cyan-100 relative">
      {/* 移除了右上角的全屏独立按钮 */}
      <WeighingTopNav />

      <div className="px-6 py-6">
        <div className="grid grid-cols-12 gap-6 mb-6">
          <div className={`col-span-8 ${cardStyle} flex flex-col justify-between`}>
            <WeighingStatusLights />
            
            <div className="flex flex-col items-center justify-center my-2 translate-y-[100px]">
              <div className="border-2 border-cyan-400/60 rounded-lg p-6 bg-[#051a3a]/60 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                <WeighingDisplay currentWeight="12,345" />
                <div className="w-full max-w-md h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 rounded-full mt-1 animate-pulse"></div>
              </div>
            </div>
            
            <div className="mt-auto flex justify-center">
              {/* 向操作按钮组件传递全屏相关props */}
              <WeighingActionButtons
                onHeavy={handleHeavy}
                onEmpty={handleEmpty}
                onSaveTare={handleSaveTare}
                onSave={handleSave}
                onPrint={handlePrint}
                onClear={handleClear}
                isFullscreen={isFullscreen}
                onToggleFullscreen={toggleFullscreen}
              />
            </div>
          </div>

          <div className={`col-span-4 ${cardStyle} flex justify-center items-center h-full`}>
            <WeighingTruckModel />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className={`col-span-12 ${cardStyle}`}>
            <div className="mb-8">
              <WeighingForm form={form} setForm={setForm} />
            </div>
            <WeighingRecordsTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeighingHomePage;