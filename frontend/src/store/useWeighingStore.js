import { create } from "zustand";
import {
  getWeighingRecords,
  createWeighingRecord,
  deleteWeighingRecord,
  syncOfflineRecords
} from "../lib/weighingApi";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useWeighingStore = create((set, get) => ({
  records: [],
  isLoading: false,
  error: null,

  fetchWeighingRecords: async (params = {}) => {
    set({ isLoading: true, error: null });
    const { token } = useAuthStore.getState();

    if (!token) {
      toast.error("请先登录", { containerId: "toast-global" });
      set({ isLoading: false });
      useAuthStore.getState().logout();
      return [];
    }

    try {
      const data = await getWeighingRecords(params);
      set({
        records: Array.isArray(data) ? data : [],
        isLoading: false,
      });
      return data;
    } catch (error) {
      console.error("获取称重记录失败:", error);
      const errorMsg = error.response?.data?.message || "获取称重记录失败";

      if (error.response?.status === 401) {
        toast.error("登录已过期，请重新登录", { containerId: "toast-global" });
        useAuthStore.getState().logout();
      } else {
        toast.error(errorMsg, { containerId: "toast-global" });
      }

      set({ error: errorMsg, isLoading: false, records: [] });
      throw error;
    }
  },

  createWeighingRecord: async (payload) => {
    set({ isLoading: true, error: null });
    const { token } = useAuthStore.getState();

    if (!token) {
      toast.error("请先登录", { containerId: "toast-global" });
      set({ isLoading: false });
      return null;
    }

    try {
      const newRecord = await createWeighingRecord(payload);
      set({
        records: [newRecord, ...get().records],
        isLoading: false,
      });
      toast.success("保存成功", { containerId: "toast-global" });
      return newRecord;
    } catch (error) {
      console.error("创建称重记录失败:", error);
      const errorMsg = error.response?.data?.message || "保存失败";

      if (error.response?.status === 401) {
        toast.error("登录已过期，请重新登录", { containerId: "toast-global" });
        useAuthStore.getState().logout();
      } else {
        toast.error(errorMsg, { containerId: "toast-global" });
      }

      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  deleteWeighingRecord: async (id) => {
    set({ isLoading: true, error: null });
    const { token } = useAuthStore.getState();

    if (!token) {
      toast.error("请先登录", { containerId: "toast-global" });
      set({ isLoading: false });
      return;
    }

    try {
      await deleteWeighingRecord(id);
      set({
        records: get().records.filter((item) => item._id !== id),
        isLoading: false,
      });
      toast.success("删除成功", { containerId: "toast-global" });
    } catch (error) {
      console.error("删除称重记录失败:", error);
      const errorMsg = error.response?.data?.message || "删除失败";

      if (error.response?.status === 401) {
        toast.error("登录已过期，请重新登录", { containerId: "toast-global" });
        useAuthStore.getState().logout();
      } else {
        toast.error(errorMsg, { containerId: "toast-global" });
      }

      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  syncOfflineRecords: async (records) => {
    set({ isLoading: true, error: null });
    try {
      const data = await syncOfflineRecords(records);
      set({ isLoading: false });
      toast.success("离线同步成功", { containerId: "toast-global" });
      return data;
    } catch (error) {
      console.error("离线同步失败:", error);
      const errorMsg = error.response?.data?.message || "离线同步失败";
      set({ error: errorMsg, isLoading: false });
      toast.error(errorMsg, { containerId: "toast-global" });
      throw error;
    }
  },
}));