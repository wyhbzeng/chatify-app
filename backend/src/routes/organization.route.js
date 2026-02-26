import express from "express";
import organizationController from "../controllers/organization.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/add", protectRoute, organizationController.createOrganization);
router.get("/:id", protectRoute, organizationController.getOrganizationById);
router.put("/update/:id", protectRoute, organizationController.updateOrganization);
router.delete("/delete/:id", protectRoute, organizationController.deleteOrganization);
router.get("/", protectRoute, organizationController.getOrganizationList);

export default router;