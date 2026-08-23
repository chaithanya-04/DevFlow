import express from 'express';
import {
  getUsers,
  getUserProfile,
  updateProfile,
  updatePreferences,
  changePassword,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes here are protected
router.use(protect);

router.get('/', getUsers);
router.get('/profile', getUserProfile);
router.put('/profile', updateProfile);
router.put('/preferences', updatePreferences);
router.put('/change-password', changePassword);

export default router;