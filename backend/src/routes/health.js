import express from  "express";
import { protect } from "../middleware/auth.js";
import { getHealthScore } from "../controllers/healthController.js";

const router = express.Router();

router.use(protect);
router.get('/:projectId', getHealthScore);

export default router;