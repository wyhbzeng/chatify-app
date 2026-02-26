import express from 'express';
import menuController from '../controllers/menu.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/add', protectRoute, menuController.createMenu);
router.get('/:id', protectRoute, menuController.getMenuById);
router.put('/update/:id', protectRoute, menuController.updateMenu);
router.delete('/delete/:id', protectRoute, menuController.deleteMenu);
router.get('/', protectRoute, menuController.getMenuList);
router.get('/tree', protectRoute, menuController.getMenuTree);

export default router;