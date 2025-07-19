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
  sendMail,
  smptpsetup,
  verifysmtpController,
  fetchUserEmailSendDetails,
} from '../controllers/geminiController.js';
import multer from 'multer';

const routes = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

routes.post('/u/login', loginUserController);
routes.post('/reset', authUser, passwordRest);
routes.post('/send/otp', sendOtp);
routes.post('/verify/otp', userOtpVerifyController);
routes.put('/update/pass', userUpdatePasswordController);

// UPDATED: Add upload.array('attachments') for file support
routes.post('/sendmail', authUser, upload.array('attachments'), sendMail);

routes.post('/smtp', authUser, smptpsetup);
routes.get('/smtp', authUser, verifysmtpController);
routes.get('/email-history', authUser, fetchUserEmailSendDetails);

export default routes;
