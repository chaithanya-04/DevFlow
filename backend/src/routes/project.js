import express from 'express';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject
} from '../controllers/projectController.js';

const router = express.Router();

router.use(protect);

// Routes accessible by any logged-in user
router.get('/', getAllProjects);
router.get('/:id', getProjectById);

// Admin-only routes
router.post('/', authorize('Admin'), createProject);
router.put('/:id', authorize('Admin'), updateProject);
router.delete('/:id', authorize('Admin'), deleteProject);

export default router;
