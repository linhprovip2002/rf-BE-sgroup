
import express from 'express';
import authController from './auth.controller';
import {clearCache} from '../../middleware/index';
const route = express.Router();

route.post('/login', authController.login);
route.post('/register', clearCache ,authController.register);
route.post('/forgot-password', authController.forgotPassword);
route.post('/reset-password/:tokenResetPassword', authController.resetPassword);

export default route;