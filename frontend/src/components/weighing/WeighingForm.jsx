import React from 'react';

const FormInput = ({ label, name, placeholder, value, onChange, type = "text" }) => {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-cyan-300 w-16">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-cyan-900/20 border border-cyan-800/50 rounded px-2 py-1 text-sm text-cyan-100 focus:outline-none focus:border-cyan-400"
      />
    </div>
  );
};

const WeighingForm = ({ formData, onChange }) => {
  const handleChange = (name, value) => {
    onChange(name, value);
  };

  return (
    <div className="grid grid-cols-3 gap-x-4 gap-y-1.5 px-1">
      <div className="flex flex-col gap-1.5">
        <FormInput label="车号" name="carNo" placeholder="请输入" value={formData.carNo} onChange={handleChange} />
        <FormInput label="发货单位" name="sender" placeholder="请输入" value={formData.sender} onChange={handleChange} />
        <FormInput label="毛重(kg)" name="grossWeight" placeholder="0.00" type="number" value={formData.grossWeight} onChange={handleChange} />
        <FormInput label="净重(kg)" name="netWeight" placeholder="0.00" type="number" value={formData.netWeight} onChange={handleChange} />
      </div>
      <div className="flex flex-col gap-1.5">
        <FormInput label="货名" name="goodsName" placeholder="请输入" value={formData.goodsName} onChange={handleChange} />
        <FormInput label="收货单位" name="receiver" placeholder="请输入" value={formData.receiver} onChange={handleChange} />
        <FormInput label="皮重(kg)" name="tareWeight" placeholder="0.00" type="number" value={formData.tareWeight} onChange={handleChange} />
        <FormInput label="金额" name="amount" placeholder="0.00" type="number" value={formData.amount} onChange={handleChange} />
      </div>
      <div className="flex flex-col gap-1.5">
        <FormInput label="规格" name="spec" placeholder="普通" value={formData.spec} onChange={handleChange} />
        <FormInput label="备注" name="remark" placeholder="正常" value={formData.remark} onChange={handleChange} />
        <FormInput label="实际重量" name="actualWeight" placeholder="0.00" type="number" value={formData.actualWeight} onChange={handleChange} />
      </div>
    </div>
  );
};

export default WeighingForm;