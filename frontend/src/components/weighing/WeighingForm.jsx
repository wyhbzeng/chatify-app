import React from 'react';

const WeighingForm = ({ form, setForm }) => {
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="grid grid-cols-3 gap-x-8 gap-y-4 w-full max-w-none">
      {/* 第一行：毛重、车号、货名 */}
      <div>
        <label className="text-xs text-cyan-200 mb-1 block">毛重</label>
        <input
          type="number"
          name="grossWeight"
          value={form.grossWeight}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-[#051a3a] border border-cyan-600/50 rounded-md
                   text-white placeholder-cyan-700 shadow-[0_0_6px_rgba(6,182,212,0.3)]
                   focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.5)]"
        />
      </div>
      <div>
        <label className="text-xs text-cyan-200 mb-1 block">车号</label>
        <input
          type="text"
          name="vehicleNo"
          value={form.vehicleNo}
          onChange={handleChange}
          placeholder="请输入或选择车号"
          className="w-full px-4 py-3 bg-[#051a3a] border border-cyan-600/50 rounded-md
                   text-white placeholder-cyan-700 shadow-[0_0_6px_rgba(6,182,212,0.3)]
                   focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.5)]"
        />
      </div>
      <div>
        <label className="text-xs text-cyan-200 mb-1 block">货名</label>
        <input
          type="text"
          name="goodsName"
          value={form.goodsName}
          onChange={handleChange}
          placeholder="请输入或选择货名"
          className="w-full px-4 py-3 bg-[#051a3a] border border-cyan-600/50 rounded-md
                   text-white placeholder-cyan-700 shadow-[0_0_6px_rgba(6,182,212,0.3)]
                   focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.5)]"
        />
      </div>

      {/* 第二行：皮重、发货单位、规格 */}
      <div>
        <label className="text-xs text-cyan-200 mb-1 block">皮重</label>
        <input
          type="number"
          name="tareWeight"
          value={form.tareWeight}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-[#051a3a] border border-cyan-600/50 rounded-md
                   text-white placeholder-cyan-700 shadow-[0_0_6px_rgba(6,182,212,0.3)]
                   focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.5)]"
        />
      </div>
      <div>
        <label className="text-xs text-cyan-200 mb-1 block">发货单位</label>
        <input
          type="text"
          name="senderUnit"
          value={form.senderUnit}
          onChange={handleChange}
          placeholder="请输入或选择发货单位"
          className="w-full px-4 py-3 bg-[#051a3a] border border-cyan-600/50 rounded-md
                   text-white placeholder-cyan-700 shadow-[0_0_6px_rgba(6,182,212,0.3)]
                   focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.5)]"
        />
      </div>
      <div>
        <label className="text-xs text-cyan-200 mb-1 block">规格</label>
        <input
          type="text"
          name="specification"
          value={form.specification}
          onChange={handleChange}
          placeholder="请输入或选择规格"
          className="w-full px-4 py-3 bg-[#051a3a] border border-cyan-600/50 rounded-md
                   text-white placeholder-cyan-700 shadow-[0_0_6px_rgba(6,182,212,0.3)]
                   focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.5)]"
        />
      </div>

      {/* 第三行：净重、收货单位、备注 */}
      <div>
        <label className="text-xs text-cyan-200 mb-1 block">净重</label>
        <input
          type="number"
          name="netWeight"
          value={form.netWeight}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-[#051a3a] border border-cyan-600/50 rounded-md
                   text-white placeholder-cyan-700 shadow-[0_0_6px_rgba(6,182,212,0.3)]
                   focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.5)]"
        />
      </div>
      <div>
        <label className="text-xs text-cyan-200 mb-1 block">收货单位</label>
        <input
          type="text"
          name="receiverUnit"
          value={form.receiverUnit}
          onChange={handleChange}
          placeholder="请输入或选择收货单位"
          className="w-full px-4 py-3 bg-[#051a3a] border border-cyan-600/50 rounded-md
                   text-white placeholder-cyan-700 shadow-[0_0_6px_rgba(6,182,212,0.3)]
                   focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.5)]"
        />
      </div>
      <div>
        <label className="text-xs text-cyan-200 mb-1 block">备注</label>
        <input
          type="text"
          name="remark"
          value={form.remark}
          onChange={handleChange}
          placeholder="请输入备注"
          className="w-full px-4 py-3 bg-[#051a3a] border border-cyan-600/50 rounded-md
                   text-white placeholder-cyan-700 shadow-[0_0_6px_rgba(6,182,212,0.3)]
                   focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.5)]"
        />
      </div>

      {/* 第四行：实重、金额 */}
      <div>
        <label className="text-xs text-cyan-200 mb-1 block">实重</label>
        <input
          type="number"
          name="actualWeight"
          value={form.actualWeight}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-[#051a3a] border border-cyan-600/50 rounded-md
                   text-white placeholder-cyan-700 shadow-[0_0_6px_rgba(6,182,212,0.3)]
                   focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.5)]"
        />
      </div>
      <div>
        <label className="text-xs text-cyan-200 mb-1 block">金额</label>
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-[#051a3a] border border-cyan-600/50 rounded-md
                   text-white placeholder-cyan-700 shadow-[0_0_6px_rgba(6,182,212,0.3)]
                   focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.5)]"
        />
      </div>
      {/* 第三列空出，保持布局对齐 */}
      <div></div>
    </div>
  );
};

export default WeighingForm;