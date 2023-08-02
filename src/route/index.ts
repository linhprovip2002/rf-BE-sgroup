import express from 'express';
import { userRoute }  from './user';
import {authRoute} from './auth';
import {pollRouter} from './poll';
import { verify } from '../middleware';
const router = express.Router();

router.use('/polls', verify, pollRouter);
router.use('/users', verify ,userRoute);
router.use('/auth', authRoute)
export default router;