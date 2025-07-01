import { loginUserController } from '../controllers/authController.js';
import express from 'express';
import authUser from '../middlewares/authMiddleware.js';
import { passwordRest } from '../controllers/userController.js';
import {
  sendOtp,
  userOtpVerifyController,
  userUpdatePasswordController,
} from '../controllers/otpAdminController.js';
import {
  genrateEmail,
  sendMail,
  smptpsetup,
  verifysmtpController,
  genrateStreamController,
  fetchUserEmailSendDetails,
} from '../controllers/geminiController.js';
const routes = express.Router();

routes.post('/u/login', loginUserController);
routes.post('/reset', authUser, passwordRest);
routes.post('/send/otp', sendOtp);
routes.post('/verify/otp', userOtpVerifyController);
routes.put('/update/pass', userUpdatePasswordController);
routes.post('/genratemail', authUser, genrateEmail);
routes.get('/stream-email', genrateStreamController);
routes.post('/sendmail', authUser, sendMail);
routes.post('/smtp', authUser, smptpsetup);
routes.get('/smtp', authUser, verifysmtpController);
routes.get('/email-history', authUser, fetchUserEmailSendDetails);
// routes.get('verifytoken', authUser);

export default routes;
