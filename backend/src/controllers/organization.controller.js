import Organization from "../models/Organization.js";
import Role from "../models/Role.js";
import User from "../models/User.js";
import mongoose from "mongoose";

export const createOrganization = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { orgName, orgCode, status, remark } = req.body;

    if (!orgName || !orgCode) {
      return res.status(400).json({
        code: 400,
        msg: "组织名称、编码不能为空"
      });
    }

    const existOrg = await Organization.findOne({ orgCode });
    if (existOrg) {
      return res.status(400).json({ code: 400, msg: "组织编码已存在" });
    }

    const org = new Organization({
      orgName,
      orgCode,
      status: status ?? true,
      remark: remark || "",
      createdBy: req.user?._id,
    });

    const savedOrg = await org.save({ session });

    // 自动创建组织管理员角色
    const adminRole = new Role({
      roleName: "组织管理员",
      roleCode: `ORG_ADMIN_${savedOrg._id}`,
      organizationId: savedOrg._id,
      remark: "系统自动创建",
      status: true,
      createdBy: req.user?._id,
    });
    await adminRole.save({ session });

    // 将用户加入组织，并设为当前组织
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { organizationIds: savedOrg._id },
        currentOrgId: savedOrg._id,
        $addToSet: { roleIds: adminRole._id }
      },
      { session }
    );

    await session.commitTransaction();
    res.status(201).json({ code: 200, msg: "创建成功", data: savedOrg });

  } catch (err) {
    await session.abortTransaction();
    console.error(err);
    res.status(500).json({ code: 500, msg: "创建失败，已回滚" });
  } finally {
    session.endSession();
  }
};

export const updateOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ code: 400, msg: "无效ID" });
    }

    if (req.body.orgCode) {
      const exist = await Organization.findOne({
        orgCode: req.body.orgCode,
        _id: { $ne: id }
      });
      if (exist) {
        return res.status(400).json({ code: 400, msg: "组织编码已存在" });
      }
    }

    const updated = await Organization.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ code: 404, msg: "不存在" });

    res.status(200).json({ code: 200, msg: "修改成功", data: updated });

  } catch (err) {
    res.status(500).json({ code: 500, msg: "修改失败" });
  }
};

export const deleteOrganization = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ code: 400, msg: "无效ID" });
    }

    await Role.deleteMany({ organizationId: id }, { session });
    await User.updateMany(
      { organizationId: id },
      { $set: { organizationId: null, roleIds: [] } },
      { session }
    );

    const del = await Organization.findByIdAndDelete(id, { session });
    if (!del) {
      return res.status(404).json({ code: 404, msg: "不存在" });
    }

    await session.commitTransaction();
    res.status(200).json({ code: 200, msg: "删除成功" });

  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ code: 500, msg: "删除失败" });
  } finally {
    session.endSession();
  }
};

export const getOrganizationList = async (req, res) => {
  try {
    const list = await Organization.find().sort({ createdAt: -1 });
    res.status(200).json({ code: 200, msg: "查询成功", data: list });
  } catch (err) {
    res.status(500).json({ code: 500, msg: "查询失败" });
  }
};

export const getOrganizationById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ code: 400, msg: "无效ID" });
    }

    const org = await Organization.findById(id);
    if (!org) return res.status(404).json({ code: 404, msg: "不存在" });
    res.status(200).json({ code: 200, msg: "查询成功", data: org });

  } catch (err) {
    res.status(500).json({ code: 500, msg: "查询失败" });
  }
};

export default {
  createOrganization,
  updateOrganization,
  deleteOrganization,
  getOrganizationList,
  getOrganizationById
};