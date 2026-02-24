import React, { useState, useRef, useCallback } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useWeighingStore } from '../../store/useWeighingStore';
import toast from 'react-hot-toast';

// 导入组件
import WeighingDataTable from '../../components/weighing/WeighingDataTable';
import BottomActionBar from '../../components/weighing/BottomActionBar';
import WeighingForm from '../../components/weighing/WeighingForm';
import VehicleVisual from '../../components/weighing/VehicleVisual';
import OperationPanel from '../../components/weighing/OperationPanel';
import WeightDisplay from '../../components/weighing/WeightDisplay';
import WeighingHeader from '../../components/weighing/WeighingHeader';

// 状态灯
const StatusLights = React.memo(() => {
  const lights = [
    { color: 'red', active: true },
    { color: 'green', active: true },
    { color: 'red', active: true },
    { color: 'green', active: true },
    { color: 'red', active: true },
    { color: 'green', active: true },
    { color: 'red', active: true },
    { color: 'green', active: true },
    { color: 'red', active: true },
    { color: 'green', active: true },
  ];

  return (
    <div className="flex justify-center gap-1.5 py-1 relative z-10">
      {lights.map((light, idx) => (
        <div
          key={idx}
          className={`w-1.5 h-1.5 rounded-full ${
            light.active
              ? light.color === 'red'
                ? 'bg-red-500'
                : 'bg-green-500'
              : 'bg-gray-600'
          }`}
        />
      ))}
    </div>
  );
});

const WeighingHomePage = () => {
  // 核心状态
  const authUser = useAuthStore.getState().authUser;
  const displayName = authUser?.fullName || authUser?.username || '用户';

  const { fetchWeighingRecords, createWeighingRecord, deleteWeighingRecord } = useWeighingStore();

  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [weight, setWeight] = useState('33300');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fullScreenRef = useRef(null);

  const [formData, setFormData] = useState({
    grossWeight: '',
    tareWeight: '',
    netWeight: '',
    actualWeight: weight,
    carNo: '',
    sender: '',
    receiver: '',
    amount: '0',
    goodsName: '',
    spec: '普通',
    remark: '',
  });

  const fetchLock = useRef(false);
  const savingLock = useRef(false);

  // 加载记录
  const loadRecords = useCallback(async (params = {}) => {
    if (fetchLock.current) return;
    fetchLock.current = true;
    setIsLoading(true);
    try {
      const res = await fetchWeighingRecords({
        page: params.page || page,
        limit,
        append: params.append || (page > 1)
      });
      const list = res?.data || [];
      const safeData = Array.isArray(list) ? list : [];
      setTotal(res?.pagination?.total || 0);
      setRecords(prev => params.append ? [...prev, ...safeData] : safeData);
    } catch (err) {
      console.error('加载失败:', err);
      toast.error('加载称重记录失败！');
    } finally {
      fetchLock.current = false;
      setIsLoading(false);
    }
  }, [fetchWeighingRecords, page, limit]);

  // 首次加载
  React.useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  // 滚动加载
  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const isBottom = scrollTop + clientHeight >= scrollHeight - 50;
    if (isBottom && !isLoading && records.length < total) {
      setPage(prev => prev + 1);
    }
  }, [isLoading, records.length, total]);

  // 全屏
  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      fullScreenRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // 表单改变
  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 保存
  const handleSave = async () => {
    if (savingLock.current) return;
    if (!formData.carNo?.trim() || !formData.goodsName?.trim()) {
      toast.error('车号和货名不能为空！');
      return;
    }

    savingLock.current = true;
    const payload = {
      vehicleNo: formData.carNo.trim(),
      goodsName: formData.goodsName.trim(),
      specification: formData.spec,
      senderUnit: formData.sender,
      receiverUnit: formData.receiver,
      grossWeight: formData.grossWeight,
      tareWeight: formData.tareWeight,
      netWeight: formData.netWeight,
      remark: formData.remark,
      operatorId: authUser?._id,
      isOffline: false,
      syncStatus: 'synced'
    };

    try {
      await createWeighingRecord(payload);
      setFormData({
        grossWeight: '',
        tareWeight: '',
        netWeight: '',
        actualWeight: weight,
        carNo: '',
        sender: '',
        receiver: '',
        amount: '0',
        goodsName: '',
        spec: '普通',
        remark: '',
      });
      setPage(1);
      loadRecords({ page: 1, append: false });
    } catch (err) {
      console.error('保存失败:', err);
    } finally {
      savingLock.current = false;
    }
  };

  // 删除
  const handleDelete = async (id) => {
    try {
      await deleteWeighingRecord(id);
      setRecords(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error('删除失败:', err);
    }
  };

  // 清空
  const handleClear = () => {
    setFormData({
      grossWeight: '',
      tareWeight: '',
      netWeight: '',
      actualWeight: weight,
      carNo: '',
      sender: '',
      receiver: '',
      amount: '0',
      goodsName: '',
      spec: '普通',
      remark: '',
    });
  };

  // 空方法
  const handleHeavyTruck = () => {};
  const handleEmptyTruck = () => {};
  const handleSaveTare = () => {};
  const handlePrint = () => {};

  // ==========================
  // 核心修复：提升所有交互区域的 z-index，使其高于全局遮罩层
  // ==========================
  return (
    <div 
      ref={fullScreenRef} 
      className="h-screen w-full bg-[#051020] text-cyan-100 flex flex-col relative z-0"
    >
      {/* 提升顶部栏的层级 */}
      <div className="relative z-20">
        <WeighingHeader userName={displayName} />
      </div>

      <div className="flex-1 flex flex-col p-2 gap-2 w-full relative z-10">
        {/* 上半区容器 */}
        <div className="flex flex-col md:flex-row gap-2 h-[360px] shrink-0">
          {/* 表单操作区（核心交互，提升层级） */}
          <div className="flex-[2] bg-[#0a1a2f] rounded-lg p-2 flex flex-col border border-cyan-900/50 relative z-20">
            <StatusLights />
            <WeightDisplay weight={weight} status={{ stable: true, transmitting: true }} />
            <WeighingForm formData={formData} onChange={handleFormChange} />
            <OperationPanel
              onHeavyTruck={handleHeavyTruck}
              onEmptyTruck={handleEmptyTruck}
              onSaveTare={handleSaveTare}
              onSave={handleSave}
              onPrint={handlePrint}
              onClear={handleClear}
              onFullscreen={handleFullscreen}
              isFullscreen={isFullscreen}
            />
          </div>

          {/* 车辆可视化区 */}
          <div className="flex-[1] bg-[#0a1a2f] rounded-lg p-2 flex items-center justify-center border border-cyan-900/50 relative z-10">
            <VehicleVisual />
          </div>
        </div>

        {/* 表格区（提升层级） */}
        <div className="flex-1 bg-[#0a1a2f] rounded-lg flex flex-col overflow-hidden border border-cyan-900/50 relative z-20">
          <div 
            className="flex-1 overflow-y-auto" 
            onScroll={handleScroll}
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#051020]/80 z-50">
                <span className="text-cyan-200">加载中...</span>
              </div>
            )}
            <WeighingDataTable data={records} onDelete={handleDelete} />
          </div>

          <BottomActionBar
            onRefresh={() => {
              setPage(1);
              loadRecords({ page: 1, append: false });
            }}
            total={total}
          />
        </div>
      </div>
    </div>
  );
};

export default WeighingHomePage;