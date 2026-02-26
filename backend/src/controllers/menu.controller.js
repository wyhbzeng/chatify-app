import Menu from "../models/menu.model.js";
import mongoose from "mongoose";

const createMenu = async (req, res) => {
  try {
    const { organizationId } = req;
    const menu = new Menu({ ...req.body, organizationId });
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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ code: 400, msg: "无效ID" });
    }
    const menu = await Menu.findOneAndUpdate(
      { _id: id, organizationId },
      req.body,
      { new: true }
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