import React from 'react';

const WeighingRecordsTable = ({ records = [] }) => {
  // 模拟数据
  const mockRecords = [
    { serialNo: "202501020501", vehicleNo: "1256325", senderUnit: "河北东风责任有限公司", receiverUnit: "河北东风责任有限公司", goodsName: "砂子", specification: "辆", grossWeight: 5623, tareWeight: 5623, netWeight: 5623, grossTime: "2025-06-06 12:00:00", tareTime: "2025-06-06 12:00:00", remark: "文字补充" },
    { serialNo: "202501020501", vehicleNo: "1256325", senderUnit: "河北东风责任有限公司", receiverUnit: "河北东风责任有限公司", goodsName: "砂子", specification: "辆", grossWeight: 5623, tareWeight: 5623, netWeight: 5623, grossTime: "2025-06-06 12:00:00", tareTime: "2025-06-06 12:00:00", remark: "文字补充" },
    { serialNo: "202501020501", vehicleNo: "1256325", senderUnit: "河北东风责任有限公司", receiverUnit: "河北东风责任有限公司", goodsName: "砂子", specification: "辆", grossWeight: 5623, tareWeight: 5623, netWeight: 5623, grossTime: "2025-06-06 12:00:00", tareTime: "2025-06-06 12:00:00", remark: "文字补充" },
    { serialNo: "202501020501", vehicleNo: "1256325", senderUnit: "河北东风责任有限公司", receiverUnit: "河北东风责任有限公司", goodsName: "砂子", specification: "辆", grossWeight: 5623, tareWeight: 5623, netWeight: 5623, grossTime: "2025-06-06 12:00:00", tareTime: "2025-06-06 12:00:00", remark: "文字补充" },
    { serialNo: "202501020501", vehicleNo: "1256325", senderUnit: "河北东风责任有限公司", receiverUnit: "河北东风责任有限公司", goodsName: "砂子", specification: "辆", grossWeight: 5623, tareWeight: 5623, netWeight: 5623, grossTime: "2025-06-06 12:00:00", tareTime: "2025-06-06 12:00:00", remark: "文字补充" },
    { serialNo: "202501020501", vehicleNo: "1256325", senderUnit: "河北东风责任有限公司", receiverUnit: "河北东风责任有限公司", goodsName: "砂子", specification: "辆", grossWeight: 5623, tareWeight: 5623, netWeight: 5623, grossTime: "2025-06-06 12:00:00", tareTime: "2025-06-06 12:00:00", remark: "文字补充" },
    { serialNo: "202501020501", vehicleNo: "1256325", senderUnit: "河北东风责任有限公司", receiverUnit: "河北东风责任有限公司", goodsName: "砂子", specification: "辆", grossWeight: 5623, tareWeight: 5623, netWeight: 5623, grossTime: "2025-06-06 12:00:00", tareTime: "2025-06-06 12:00:00", remark: "文字补充" },
    { serialNo: "202501020501", vehicleNo: "1256325", senderUnit: "河北东风责任有限公司", receiverUnit: "河北东风责任有限公司", goodsName: "砂子", specification: "辆", grossWeight: 5623, tareWeight: 5623, netWeight: 5623, grossTime: "2025-06-06 12:00:00", tareTime: "2025-06-06 12:00:00", remark: "文字补充" },
    { serialNo: "202501020501", vehicleNo: "1256325", senderUnit: "河北东风责任有限公司", receiverUnit: "河北东风责任有限公司", goodsName: "砂子", specification: "辆", grossWeight: 5623, tareWeight: 5623, netWeight: 5623, grossTime: "2025-06-06 12:00:00", tareTime: "2025-06-06 12:00:00", remark: "文字补充" },
    { serialNo: "202501020501", vehicleNo: "1256325", senderUnit: "河北东风责任有限公司", receiverUnit: "河北东风责任有限公司", goodsName: "砂子", specification: "辆", grossWeight: 5623, tareWeight: 5623, netWeight: 5623, grossTime: "2025-06-06 12:00:00", tareTime: "2025-06-06 12:00:00", remark: "文字补充" },
  ];

  return (
    <div className="w-full">
      <table className="w-full border-collapse border border-cyan-400/50">
        <thead>
          <tr className="bg-[#0a3d62]">
            <th className="border border-cyan-400/50 px-3 py-2 text-sm text-cyan-300">序号</th>
            <th className="border border-cyan-400/50 px-3 py-2 text-sm text-cyan-300">流水号</th>
            <th className="border border-cyan-400/50 px-3 py-2 text-sm text-cyan-300">车号</th>
            <th className="border border-cyan-400/50 px-3 py-2 text-sm text-cyan-300">发货单位</th>
            <th className="border border-cyan-400/50 px-3 py-2 text-sm text-cyan-300">收货单位</th>
            <th className="border border-cyan-400/50 px-3 py-2 text-sm text-cyan-300">货名</th>
            <th className="border border-cyan-400/50 px-3 py-2 text-sm text-cyan-300">规格</th>
            <th className="border border-cyan-400/50 px-3 py-2 text-sm text-cyan-300">毛重</th>
            <th className="border border-cyan-400/50 px-3 py-2 text-sm text-cyan-300">皮重</th>
            <th className="border border-cyan-400/50 px-3 py-2 text-sm text-cyan-300">净重</th>
            <th className="border border-cyan-400/50 px-3 py-2 text-sm text-cyan-300">毛重时间</th>
            <th className="border border-cyan-400/50 px-3 py-2 text-sm text-cyan-300">皮重时间</th>
            <th className="border border-cyan-400/50 px-3 py-2 text-sm text-cyan-300">备注</th>
          </tr>
        </thead>
        <tbody>
          {mockRecords.map((row, idx) => (
            <tr key={idx} className="hover:bg-[#0a3d62]/50">
              <td className="border border-cyan-400/50 px-3 py-2 text-sm text-cyan-200">{idx + 1}</td>
              <td className="border border-cyan-400/50 px-3 py-2 text-sm text-cyan-200">{row.serialNo}</td>
              <td className="border border-cyan-400/50 px-3 py-2 text-sm text-cyan-200">{row.vehicleNo}</td>
              <td className="border border-cyan-400/50 px-3 py-2 text-sm text-cyan-200">{row.senderUnit}</td>
              <td className="border border-cyan-400/50 px-3 py-2 text-sm text-cyan-200">{row.receiverUnit}</td>
              <td className="border border-cyan-400/50 px-3 py-2 text-sm text-cyan-200">{row.goodsName}</td>
              <td className="border border-cyan-400/50 px-3 py-2 text-sm text-cyan-200">{row.specification}</td>
              <td className="border border-cyan-400/50 px-3 py-2 text-sm text-cyan-200">{row.grossWeight}</td>
              <td className="border border-cyan-400/50 px-3 py-2 text-sm text-cyan-200">{row.tareWeight}</td>
              <td className="border border-cyan-400/50 px-3 py-2 text-sm text-cyan-200">{row.netWeight}</td>
              <td className="border border-cyan-400/50 px-3 py-2 text-sm text-cyan-200">{row.grossTime}</td>
              <td className="border border-cyan-400/50 px-3 py-2 text-sm text-cyan-200">{row.tareTime}</td>
              <td className="border border-cyan-400/50 px-3 py-2 text-sm text-cyan-200">{row.remark}</td>
            </tr>
          ))}
          <tr className="bg-[#0a3d62]">
            <td className="border border-cyan-400/50 px-3 py-2 text-sm text-cyan-300" colSpan="7">共{mockRecords.length}条</td>
            <td className="border border-cyan-400/50 px-3 py-2 text-sm text-cyan-300">28006</td>
            <td className="border border-cyan-400/50 px-3 py-2 text-sm text-cyan-300">28006</td>
            <td className="border border-cyan-400/50 px-3 py-2 text-sm text-cyan-300">28006</td>
            <td className="border border-cyan-400/50 px-3 py-2 text-sm text-cyan-300" colSpan="3"></td>
          </tr>
        </tbody>
      </table>

      {/* 底部筛选和功能按钮 */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-4">
          <select className="px-3 py-2 bg-[#051a3a] border border-cyan-600/50 rounded-md text-cyan-200 focus:outline-none focus:border-cyan-400">
            <option>清泥沙</option>
          </select>
          <select className="px-3 py-2 bg-[#051a3a] border border-cyan-600/50 rounded-md text-cyan-200 focus:outline-none focus:border-cyan-400">
            <option>清定标</option>
          </select>
        </div>
        <div className="flex gap-3">
          <button className="px-3 py-1.5 bg-[#0a3d62] border border-cyan-400/50 rounded-md text-xs text-cyan-200 hover:bg-cyan-900/30 transition-colors">过磅图片</button>
          <button className="px-3 py-1.5 bg-[#0a3d62] border border-cyan-400/50 rounded-md text-xs text-cyan-200 hover:bg-cyan-900/30 transition-colors">显示字段</button>
          <button className="px-3 py-1.5 bg-[#0a3d62] border border-cyan-400/50 rounded-md text-xs text-cyan-200 hover:bg-cyan-900/30 transition-colors">数据导出</button>
          <button className="px-3 py-1.5 bg-[#0a3d62] border border-cyan-400/50 rounded-md text-xs text-cyan-200 hover:bg-cyan-900/30 transition-colors">打印报表</button>
        </div>
      </div>
    </div>
  );
};

export default WeighingRecordsTable;