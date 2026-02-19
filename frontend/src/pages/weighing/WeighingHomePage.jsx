import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

  // 操作按钮回调
  const handleHeavy = () => { /* 重车逻辑 */ };
  const handleEmpty = () => { /* 空车逻辑 */ };
  const handleSaveTare = () => { /* 存皮逻辑 */ };
  const handleSave = () => { /* 保存逻辑 */ };
  const handlePrint = () => { /* 打印逻辑 */ };
  const handleClear = () => { setForm({ /* 重置表单 */ }); };

  // 卡片通用样式：浅青蓝渐变背景 + 圆角 + 阴影 + 边框
  const cardStyle = "bg-gradient-to-br from-cyan-900/40 to-cyan-800/20 border border-cyan-700/50 rounded-xl shadow-lg shadow-cyan-900/20 p-6";

  return (
    <div className="min-h-screen w-full bg-[#051020] text-cyan-100">
      {/* 顶部导航 */}
      <WeighingTopNav />

      <div className="px-6 py-6">
        {/* 三卡片布局：网格分栏，间距合理 */}
        <div className="grid grid-cols-12 gap-6 mb-6">
          {/* 卡片1：重量显示 + 状态灯 + 操作按钮（占8列，内部垂直布局） */}
          <div className={`col-span-8 ${cardStyle} flex flex-col justify-between`}>
            {/* 顶部：红绿灯状态灯（一行显示） */}
            <WeighingStatusLights />
            
            {/* 中间：重量显示 + 动感条（整体向下偏移100px） */}
            <div className="flex flex-col items-center justify-center my-2 translate-y-[100px]">
              {/* 重量显示框（添加边框，贴合参考图） */}
              <div className="border-2 border-cyan-400/60 rounded-lg p-6 bg-[#051a3a]/60 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                <WeighingDisplay currentWeight="12,345" />
                {/* 动感渐变条（拉近与重量的距离） */}
                <div className="w-full max-w-md h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 rounded-full mt-1 animate-pulse"></div>
              </div>
            </div>
            
            {/* 底部：操作按钮（居中，带图标） */}
            <div className="mt-auto flex justify-center">
              <WeighingActionButtons
                onHeavy={handleHeavy}
                onEmpty={handleEmpty}
                onSaveTare={handleSaveTare}
                onSave={handleSave}
                onPrint={handlePrint}
                onClear={handleClear}
              />
            </div>
          </div>

          {/* 卡片2：全息卡车模型（占4列） */}
          <div className={`col-span-4 ${cardStyle} flex justify-center items-center h-full`}>
            <WeighingTruckModel />
          </div>
        </div>

        {/* 第二行网格：卡片3 - 表单 + 记录表格（通栏12列） */}
        <div className="grid grid-cols-12 gap-6">
          {/* 卡片3：表单 + 记录表格（占12列） */}
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