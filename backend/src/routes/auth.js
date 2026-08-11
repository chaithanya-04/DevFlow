import express from "express";
import { signup, login, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', getMe, protect)

export default router;

