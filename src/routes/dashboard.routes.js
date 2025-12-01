import { Router } from 'express';
import { authRequired } from '../middlewares/auth.js';
import { getStats, getMyDashboard } from '../controllers/dashboard.controller.js';

const router = Router();

router.get('/stats', getStats);
router.get('/me', authRequired, getMyDashboard);

export default router;
