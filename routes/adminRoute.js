import express from 'express';
import { getUser, createUser } from '../controllers/userController.js';
import { AdminCreate, listAdmins } from '../controllers/adminController.js';
import authAdmin from '../middlewares/authAdmin.js';
import {
  loginAdminController,
  updateSmtpController,
  verifySmtpController,
} from '../controllers/authController.js';
import {
  otpVerifyController,
  sendOtp,
  updatePasswordController,
} from '../controllers/otpAdminController.js';

const routes = express.Router();

// admin create
routes.post('/u/login', loginAdminController);
routes.post('/create', AdminCreate);
routes.put('/:id/smtp', authAdmin, updateSmtpController);
routes.get('/:id/smtp', authAdmin, verifySmtpController);

// create user
routes.post('/:adminId/create', authAdmin, createUser);
routes.get('/:adminId', authAdmin, getUser); // getAllUser
routes.post('/forgotPasswd', sendOtp);
routes.post('/verify/otp', otpVerifyController);
routes.put('/update', updatePasswordController);

routes.get('/', listAdmins); // list all admins
export default routes;
