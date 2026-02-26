import Role from "../models/role.model.js";
import Menu from "../models/menu.model.js";
import mongoose from "mongoose";

const createRole = async (req, res) => {
  try {
    const { organizationId } = req;
    const { roleName, roleCode, menuIds, status, remark } = req.body;

    if (menuIds && menuIds.length > 0) {
      const validMenus = await Menu.find({
        _id: { $in: menuIds },
        organizationId
      });
      if (validMenus.length !== menuIds.length) {
        return res.status(400).json({ code: 400, msg: "存在不属于本组织的菜单ID" });
      }
    }

    const role = new Role({
      roleName,
      roleCode,
      organizationId,
      menuIds,
      status,
      remark
    });
    await role.save();
    res.status(200).json({ code: 200, msg: "添加成功", data: role });
  } catch (error) {
    console.error("新增角色失败", error);
    res.status(500).json({ code: 500, msg: "服务器错误" });
  }
};

const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const { organizationId } = req;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ code: 400, msg: "无效ID" });
    }
    const role = await Role.findOne({ _id: id, organizationId }).populate("menuIds");
    if (!role) {
      return res.status(404).json({ code: 404, msg: "角色不存在" });
    }
    res.status(200).json({ code: 200, data: role });
  } catch (error) {
    console.error("查询角色失败", error);
    res.status(500).json({ code: 500, msg: "服务器错误" });
  }
};

const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { organizationId } = req;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ code: 400, msg: "无效ID" });
    }

    const { menuIds, ...updateData } = req.body;

    if (menuIds && menuIds.length > 0) {
      const validMenus = await Menu.find({
        _id: { $in: menuIds },
        organizationId
      });
      if (validMenus.length !== menuIds.length) {
        return res.status(400).json({ code: 400, msg: "存在不属于本组织的菜单ID" });
      }
      updateData.menuIds = menuIds;
    }

    const role = await Role.findOneAndUpdate(
      { _id: id, organizationId },
      updateData,
      { new: true }
    ).populate("menuIds");
    if (!role) {
      return res.status(404).json({ code: 404, msg: "角色不存在" });
    }
    res.status(200).json({ code: 200, msg: "修改成功", data: role });
  } catch (error) {
    console.error("修改角色失败", error);
    res.status(500).json({ code: 500, msg: "服务器错误" });
  }
};

const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { organizationId } = req;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ code: 400, msg: "无效ID" });
    }
    const role = await Role.findOneAndDelete({ _id: id, organizationId });
    if (!role) {
      return res.status(404).json({ code: 404, msg: "角色不存在" });
    }
    res.status(200).json({ code: 200, msg: "删除成功" });
  } catch (error) {
    console.error("删除角色失败", error);
    res.status(500).json({ code: 500, msg: "服务器错误" });
  }
};

const getRoleList = async (req, res) => {
  try {
    const { organizationId } = req;
    const list = await Role.find({ organizationId }).populate("menuIds");
    res.status(200).json({ code: 200, data: list });
  } catch (error) {
    console.error("查询角色列表失败", error);
    res.status(500).json({ code: 500, msg: "服务器错误" });
  }
};

export default {
  createRole,
  getRoleById,
  updateRole,
  deleteRole,
  getRoleList,
};