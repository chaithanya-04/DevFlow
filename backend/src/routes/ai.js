import express from 'express';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { generateTasks } from '../controllers/aiController.js';

const router = express.Router();

router.use(protect);

router.post('/generate-taskS',authorize('Admin', 'Project Manager'),generateTasks);

export default router;