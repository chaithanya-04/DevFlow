import express from 'express';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject
} from '../controllers/projectcontroller.js';

const router = express.Router();

router.use(protect);

router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.post('/', authorize('Admin'), createProject);
router.put('/:id', authorize('Admin'), updateProject);
router.delete('/:id', authorize('Admin'), deleteProject);

export default router;
