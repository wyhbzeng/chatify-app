import Organization from "../models/organization.model.js";
import User from "../models/user.model.js";
import Role from "../models/role.model.js"; // 新增角色模型导入
import mongoose from "mongoose";

export const createOrganization = async (req, res) => {
    try {
        const { orgName, orgCode, status, remark } = req.body;

        if (!orgName || !orgCode) {
            return res.status(400).json({ 
                message: "组织名称(orgName)和组织编码(orgCode)为必填项" 
            });
        }

        const existingOrg = await Organization.findOne({ orgCode });
        if (existingOrg) {
            return res.status(400).json({ 
                message: `组织编码${orgCode}已存在，请更换` 
            });
        }

        // 1. 创建组织
        const newOrg = new Organization({
            orgName,
            orgCode,
            status: status ?? true,
            remark: remark ?? "",
            createdBy: req.user._id
        });
        const savedOrg = await newOrg.save();

        // 2. 自动为该组织创建“组织管理员”角色
        const adminRole = new Role({
            roleName: "组织管理员",
            roleCode: `ORG_ADMIN_${savedOrg._id}`, // 保证编码唯一
            organizationId: savedOrg._id, // 绑定到当前组织
            remark: `自动生成的${orgName}管理员角色`
        });
        const savedRole = await adminRole.save();

        // 3. 更新用户：绑定组织ID，并将新角色ID加入roleIds数组
        await User.findByIdAndUpdate(
            req.user._id,
            {
                organizationId: savedOrg._id,
                $addToSet: { roleIds: savedRole._id } // 使用addToSet避免重复添加
            },
            { new: true }
        );

        res.status(201).json({
            message: "组织创建成功，已自动生成管理员角色并绑定",
            organization: savedOrg,
            adminRole: savedRole
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: `组织编码或角色编码重复: ${JSON.stringify(error.keyValue)}`
            });
        }
        console.log("Create org error:", error);
        res.status(500).json({ message: "Failed to create organization" });
    }
};

const getOrganizationById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ code: 400, msg: "无效ID" });
        }
        const org = await Organization.findById(id);
        if (!org) {
            return res.status(404).json({ code: 404, msg: "组织不存在" });
        }
        res.status(200).json({ code: 200, data: org });
    } catch (error) {
        console.error("查询组织失败", error);
        res.status(500).json({ code: 500, msg: "服务器错误" });
    }
};

const updateOrganization = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ code: 400, msg: "无效ID" });
        }

        if (req.body.orgCode) {
            const existingOrg = await Organization.findOne({
                orgCode: req.body.orgCode,
                _id: { $ne: id }
            });
            if (existingOrg) {
                return res.status(400).json({
                    code: 400,
                    msg: `组织编码${req.body.orgCode}已存在`
                });
            }
        }

        const org = await Organization.findByIdAndUpdate(id, req.body, { new: true });
        if (!org) {
            return res.status(404).json({ code: 404, msg: "组织不存在" });
        }
        res.status(200).json({ code: 200, msg: "修改成功", data: org });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                code: 400,
                msg: `组织编码${error.keyValue.orgCode}已存在`
            });
        }
        console.error("修改组织失败", error);
        res.status(500).json({ code: 500, msg: "服务器错误" });
    }
};

const deleteOrganization = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ code: 400, msg: "无效ID" });
        }

        // 删除组织前，先删除该组织下的所有角色
        await Role.deleteMany({ organizationId: id });

        // 清空关联用户的organizationId和roleIds
        await User.updateMany(
            { organizationId: id },
            { 
                organizationId: null, 
                $set: { roleIds: [] } 
            }
        );

        const org = await Organization.findByIdAndDelete(id);
        if (!org) {
            return res.status(404).json({ code: 404, msg: "组织不存在" });
        }
        res.status(200).json({ code: 200, msg: "删除成功" });
    } catch (error) {
        console.error("删除组织失败", error);
        res.status(500).json({ code: 500, msg: "服务器错误" });
    }
};

const getOrganizationList = async (req, res) => {
    try {
        const list = await Organization.find();
        res.status(200).json({ code: 200, data: list });
    } catch (error) {
        console.error("查询组织列表失败", error);
        res.status(500).json({ code: 500, msg: "服务器错误" });
    }
};

export default {
    createOrganization,
    getOrganizationById,
    updateOrganization,
    deleteOrganization,
    getOrganizationList,
};