import express from 'express';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  assignTask,
  updateTaskStatus,
  deleteTask
} from '../controllers/taskController.js';

const router = express.Router();

router.use(protect);

router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', authorize('Admin', 'Project Manager'), createTask);
router.put('/:id', authorize('Admin', 'Project Manager'), updateTask);
router.put('/:id/assign', authorize('Admin', 'Project Manager'), assignTask);
router.delete('/:id', authorize('Admin', 'Project Manager'), deleteTask);
router.put('/:id/status', authorize('Admin', 'Project Manager', 'Developer'), updateTaskStatus);

export default router;
