import Menu from "../models/Menu.js";
import mongoose from "mongoose";

const createMenu = async (req, res) => {
  try {
    const { organizationId } = req;
    let { parentId, ...otherData } = req.body;

    // 核心修复：如果 parentId 是空字符串，强制转为 null
    // 同时如果传了字符串类型的ID，确保转为 ObjectId 类型
    if (parentId === "") {
      parentId = null;
    } else if (parentId && !mongoose.Types.ObjectId.isValid(parentId)) {
      // 如果传了 parentId 但格式不对，直接返回错误
      return res.status(400).json({ code: 400, msg: "parentId 格式无效" });
    }

    // 组装最终数据
    const menuData = {
      ...otherData,
      organizationId,
      parentId // 这里已经是 null 或有效的 ObjectId
    };

    const menu = new Menu(menuData);
    await menu.save();
    res.status(200).json({ code: 200, msg: "添加成功", data: menu });
  } catch (error) {
    console.error("新增菜单失败", error);
    res.status(500).json({ code: 500, msg: "服务器错误" });
  }
};

const getMenuById = async (req, res) => {
  try {
    const { id } = req.params;
    const { organizationId } = req;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ code: 400, msg: "无效ID" });
    }
    const menu = await Menu.findOne({ _id: id, organizationId });
    if (!menu) {
      return res.status(404).json({ code: 404, msg: "菜单不存在" });
    }
    res.status(200).json({ code: 200, data: menu });
  } catch (error) {
    console.error("查询菜单失败", error);
    res.status(500).json({ code: 500, msg: "服务器错误" });
  }
};

const updateMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { organizationId } = req;
    let { parentId, ...otherData } = req.body;

    // 核心修复：更新时同样处理空字符串
    if (parentId === "") {
      parentId = null;
    } else if (parentId && !mongoose.Types.ObjectId.isValid(parentId)) {
      return res.status(400).json({ code: 400, msg: "parentId 格式无效" });
    }

    const updateData = { ...otherData, parentId };

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ code: 400, msg: "无效ID" });
    }
    
    const menu = await Menu.findOneAndUpdate(
      { _id: id, organizationId },
      updateData,
      { new: true, runValidators: true } // runValidators: true 确保更新时也触发 Schema 校验
    );
    if (!menu) {
      return res.status(404).json({ code: 404, msg: "菜单不存在" });
    }
    res.status(200).json({ code: 200, msg: "修改成功", data: menu });
  } catch (error) {
    console.error("修改菜单失败", error);
    res.status(500).json({ code: 500, msg: "服务器错误" });
  }
};

const deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { organizationId } = req;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ code: 400, msg: "无效ID" });
    }
    const menu = await Menu.findOneAndDelete({ _id: id, organizationId });
    if (!menu) {
      return res.status(404).json({ code: 404, msg: "菜单不存在" });
    }
    res.status(200).json({ code: 200, msg: "删除成功" });
  } catch (error) {
    console.error("删除菜单失败", error);
    res.status(500).json({ code: 500, msg: "服务器错误" });
  }
};

const getMenuList = async (req, res) => {
  try {
    const { organizationId } = req;
    const list = await Menu.find({ organizationId });
    res.status(200).json({ code: 200, data: list });
  } catch (error) {
    console.error("查询菜单列表失败", error);
    res.status(500).json({ code: 500, msg: "服务器错误" });
  }
};

const getMenuTree = async (req, res) => {
  try {
    const { organizationId } = req;
    const allMenus = await Menu.find({ organizationId });
    const tree = buildTree(allMenus, null);
    res.status(200).json({ code: 200, data: tree });
  } catch (error) {
    console.error("查询菜单树失败", error);
    res.status(500).json({ code: 500, msg: "服务器错误" });
  }
};

function buildTree(menus, parentId) {
  return menus
    .filter(menu =>
      (parentId === null && menu.parentId === null) ||
      (menu.parentId && menu.parentId.toString() === parentId?.toString())
    )
    .map(menu => ({
      ...menu.toObject(),
      children: buildTree(menus, menu._id)
    }));
}

export default {
  createMenu,
  getMenuById,
  updateMenu,
  deleteMenu,
  getMenuList,
  getMenuTree,
};