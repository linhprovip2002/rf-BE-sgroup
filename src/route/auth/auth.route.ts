
import express from 'express';
import authController from './auth.controller';
import {clearCache} from '../../middleware/index';
import { validateLoginRequest,validateRegisterRequest,validateEmailRequest } from '../../middleware/index';
const route = express.Router();

route.post('/login',validateLoginRequest ,authController.login);
route.post('/register',validateRegisterRequest ,clearCache ,authController.register);
route.post('/forgot-password',validateEmailRequest, authController.forgotPassword);
route.post('/reset-password/:tokenResetPassword', authController.resetPassword);

export default route;