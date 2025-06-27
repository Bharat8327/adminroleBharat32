import {
  otpServices,
  otpVerifyServices,
  updatePasswordServices,
  userOtpVerificationServices,
  userPasswordUpdate,
} from '../services/otpServices.js';

export const sendOtp = async (req, res) => {
  await otpServices(req, res);
};

export const otpVerifyController = async (req, res) => {
  await otpVerifyServices(req, res);
};

export const updatePasswordController = async (req, res) => {
  await updatePasswordServices(req, res);
};

// reset password for user otp verification
export const userOtpVerifyController = async (req, res) => {
  await userOtpVerificationServices(req, res);
};

export const userUpdatePasswordController = async (req, res) => {
  await userPasswordUpdate(req, res);
};
