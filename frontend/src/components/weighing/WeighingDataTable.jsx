import React from 'react';

const WeighingDataTable = ({ data = [], onDelete }) => {
  // 强制保证 data 是数组，避免非数组导致 map 报错
  const safeData = Array.isArray(data) ? data : [];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-[#0a1a2f] text-cyan-300">
          <tr>
            <th className="px-2 py-2">序号</th>
            <th className="px-2 py-2">流水号</th>
            <th className="px-2 py-2">车号</th>
            <th className="px-2 py-2">发货单位</th>
            <th className="px-2 py-2">收货单位</th>
            <th className="px-2 py-2">货名</th>
            <th className="px-2 py-2">规格</th>
            <th className="px-2 py-2">毛重</th>
            <th className="px-2 py-2">皮重</th>
            <th className="px-2 py-2">净重</th>
            <th className="px-2 py-2">时间</th>
            <th className="px-2 py-2">备注</th>
            <th className="px-2 py-2 text-center">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-cyan-900/30">
          {/* 修复：只使用 item._id 作为 key，绝不使用 index */}
          {safeData.map((item, index) => (
            <tr key={item._id} className="hover:bg-[#0a1a2f]/50">
              <td className="px-2 py-1">{index + 1}</td>
              <td className="px-2 py-1">{item.flowNo || item.serialNo || '-'}</td>
              <td className="px-2 py-1">{item.vehicleNo || item.carNo || '-'}</td>
              <td className="px-2 py-1">{item.senderUnit || item.sender || '-'}</td>
              <td className="px-2 py-1">{item.receiverUnit || item.receiver || '-'}</td>
              <td className="px-2 py-1">{item.goodsName || '-'}</td>
              <td className="px-2 py-1">{item.specification || item.spec || '-'}</td>
              <td className="px-2 py-1">{item.grossWeight || '-'}</td>
              <td className="px-2 py-1">{item.tareWeight || '-'}</td>
              <td className="px-2 py-1">{item.netWeight || '-'}</td>
              <td className="px-2 py-1">
                {item.grossTime ? new Date(item.grossTime).toLocaleString() : '-'}
              </td>
              <td className="px-2 py-1">{item.remark || '-'}</td>
              <td className="px-2 py-1 text-center">
                <button
                  onClick={() => onDelete(item._id)}
                  className="px-2 py-1 rounded bg-red-900/30 text-red-400 hover:bg-red-900/50"
                >
                  删除
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WeighingDataTable;