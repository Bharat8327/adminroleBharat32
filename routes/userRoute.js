import { loginUserController } from '../controllers/authController.js';
import express from 'express';
import authUser from '../middlewares/authMiddleware.js';
import { passwordRest } from '../controllers/userController.js';
import {
  sendOtp,
  userOtpVerifyController,
  userUpdatePasswordController,
} from '../controllers/otpAdminController.js';
const routes = express.Router();

routes.post('/u/login', loginUserController);
routes.post('/reset', authUser, passwordRest);
routes.post('/send/otp', sendOtp);
routes.post('/verify/otp', userOtpVerifyController);
routes.put('/update/pass', userUpdatePasswordController);
export default routes;
