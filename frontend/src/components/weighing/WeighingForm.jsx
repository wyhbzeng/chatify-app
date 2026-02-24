import React from 'react';

// 独立组件，无复杂优化
const FormInput = ({ label, name, placeholder, type = "text", value, onChange }) => (
  <div className="flex items-center gap-2">
    <label className="text-cyan-300 text-sm w-20" style={{ whiteSpace: 'nowrap' }}>
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value || ''}
      onChange={onChange}
      className="flex-1 bg-[#0a1a2f] border border-cyan-900 text-cyan-200 px-2 py-1 rounded text-sm"
      placeholder={placeholder}
      autoComplete="off"
      inputMode={type === "number" ? "numeric" : "text"}
    />
  </div>
);

// 去掉复杂的 memo 和 areEqual，恢复原生 React 渲染（工业场景足够用）
const WeighingForm = ({ formData, onChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <div className="grid grid-cols-3 gap-2 px-1">
      <div className="flex flex-col gap-2">
        <FormInput label="车号" name="carNo" placeholder="请输入" value={formData.carNo} onChange={handleChange} />
        <FormInput label="发货单位" name="sender" placeholder="请输入" value={formData.sender} onChange={handleChange} />
        <FormInput label="毛重(kg)" name="grossWeight" placeholder="0.00" type="number" value={formData.grossWeight} onChange={handleChange} />
        <FormInput label="净重(kg)" name="netWeight" placeholder="0.00" type="number" value={formData.netWeight} onChange={handleChange} />
      </div>
      <div className="flex flex-col gap-2">
        <FormInput label="货名" name="goodsName" placeholder="请输入" value={formData.goodsName} onChange={handleChange} />
        <FormInput label="收货单位" name="receiver" placeholder="请输入" value={formData.receiver} onChange={handleChange} />
        <FormInput label="皮重(kg)" name="tareWeight" placeholder="0.00" type="number" value={formData.tareWeight} onChange={handleChange} />
        <FormInput label="金额" name="amount" placeholder="0.00" type="number" value={formData.amount} onChange={handleChange} />
      </div>
      <div className="flex flex-col gap-2">
        <FormInput label="规格" name="spec" placeholder="普通" value={formData.spec} onChange={handleChange} />
        <FormInput label="备注" name="remark" placeholder="正常" value={formData.remark} onChange={handleChange} />
        <FormInput label="实际重量" name="actualWeight" placeholder="0.00" type="number" value={formData.actualWeight} onChange={handleChange} />
      </div>
    </div>
  );
};

export default WeighingForm;