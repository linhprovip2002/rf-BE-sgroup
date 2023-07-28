import express from 'express';
import userRoute from './user/user.route.ts';
import authRoute from './auth/auth.route.ts';
import { verify } from '../middleware/index.ts';
const router = express.Router();

router.use('/users', verify ,userRoute);
router.use('/auth', authRoute)
export default router;