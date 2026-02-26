import express from 'express';
import roleController from '../controllers/role.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/add', protectRoute, roleController.createRole);
router.get('/:id', protectRoute, roleController.getRoleById);
router.put('/update/:id', protectRoute, roleController.updateRole);
router.delete('/delete/:id', protectRoute, roleController.deleteRole);
router.get('/', protectRoute, roleController.getRoleList);

export default router;