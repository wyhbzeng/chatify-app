import Role from "../models/role.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

// 创建角色
export const createRole = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { roleName, roleCode, organizationId, remark, status, menuIds } = req.body;

    if (!roleName || !roleCode || !organizationId) {
      return res.status(400).json({
        code: 400,
        msg: "角色名称、角色编码、所属组织不能为空"
      });
    }

    // 同一组织下编码不能重复
    const existCode = await Role.findOne({ roleCode, organizationId });
    if (existCode) {
      return res.status(400).json({
        code: 400,
        msg: "该组织下角色编码已存在"
      });
    }

    // 同一组织下名称不能重复
    const existName = await Role.findOne({ roleName, organizationId });
    if (existName) {
      return res.status(400).json({
        code: 400,
        msg: "该组织下角色名称已存在"
      });
    }

    const role = new Role({
      roleName,
      roleCode,
      organizationId,
      remark: remark || "",
      status: status ?? true,
      menuIds: menuIds || [],
      createdBy: req.user?._id,
    });

    await role.save({ session });
    await session.commitTransaction();

    res.status(201).json({ code: 200, msg: "创建成功", data: role });

  } catch (err) {
    await session.abortTransaction();
    console.error(err);
    res.status(500).json({ code: 500, msg: "创建失败" });
  } finally {
    session.endSession();
  }
};

// 修改角色
export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { roleName, roleCode, organizationId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ code: 400, msg: "无效ID" });
    }

    const old = await Role.findById(id);
    if (!old) {
      return res.status(404).json({ code: 404, msg: "角色不存在" });
    }

    const targetOrgId = organizationId || old.organizationId;

    // 检查编码重复
    if (roleCode) {
      const exist = await Role.findOne({
        roleCode,
        organizationId: targetOrgId,
        _id: { $ne: id }
      });
      if (exist) {
        return res.status(400).json({ code: 400, msg: "该组织下编码已存在" });
      }
    }

    // 检查名称重复
    if (roleName) {
      const exist = await Role.findOne({
        roleName,
        organizationId: targetOrgId,
        _id: { $ne: id }
      });
      if (exist) {
        return res.status(400).json({ code: 400, msg: "该组织下名称已存在" });
      }
    }

    const updated = await Role.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ code: 200, msg: "修改成功", data: updated });

  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, msg: "修改失败" });
  }
};

// 删除角色
export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ code: 400, msg: "无效ID" });
    }

    const user = await User.findOne({ roleIds: id });
    if (user) {
      return res.status(400).json({ code: 400, msg: "已绑定用户，无法删除" });
    }

    await Role.findByIdAndDelete(id);
    res.status(200).json({ code: 200, msg: "删除成功" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, msg: "删除失败" });
  }
};

// 查询列表
export const getRoleList = async (req, res) => {
  try {
    const list = await Role.find()
      .populate("organizationId", "orgName orgCode")
      .populate("menuIds", "menuName menuCode path")
      .sort({ createdAt: -1 });

    res.status(200).json({ code: 200, msg: "查询成功", data: list });
  } catch (err) {
    res.status(500).json({ code: 500, msg: "查询失败" });
  }
};

// 查询单个
export const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ code: 400, msg: "无效ID" });
    }

    const role = await Role.findById(id)
      .populate("organizationId", "orgName orgCode")
      .populate("menuIds", "menuName menuCode path");

    if (!role) return res.status(404).json({ code: 404, msg: "不存在" });
    res.status(200).json({ code: 200, msg: "查询成功", data: role });

  } catch (err) {
    res.status(500).json({ code: 500, msg: "查询失败" });
  }
};

export default {
  createRole,
  updateRole,
  deleteRole,
  getRoleList,
  getRoleById
};