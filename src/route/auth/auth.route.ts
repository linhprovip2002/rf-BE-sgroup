
import express from 'express';
import authController from './auth.controller';

const route = express.Router();

route.post('/login', authController.login);
route.post('/register', authController.register);
route.post('/forgot-password', authController.forgotPassword);
route.post('/reset-password/:tokenResetPassword', authController.resetPassword);

export default route;