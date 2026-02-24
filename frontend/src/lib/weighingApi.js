// src/lib/weighingApi.js
import { axiosInstance } from "./axios";

// 获取列表
export const getWeighingRecords = async (params = {}) => {
  const res = await axiosInstance.get("/weighing/records", { params });
  return res.data;
};

// 新建
export const createWeighingRecord = async (data) => {
  const res = await axiosInstance.post("/weighing/records", data);
  return res.data;
};

// 删除（新增）
export const deleteWeighingRecord = async (id) => {
  const res = await axiosInstance.delete(`/weighing/records/${id}`);
  return res.data;
};

// 离线同步
export const syncOfflineRecords = async (data) => {
  const res = await axiosInstance.post("/weighing/sync-offline", data);
  return res.data;
};