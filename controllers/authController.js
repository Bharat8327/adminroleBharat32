import {
  loginAdminServices,
  loginUserService,
  updateSmtpServices,
  verifySmtpServices,
} from '../services/authServices.js';

export const loginUserController = async (req, res) => {
  await loginUserService(req, res);
};

export const loginAdminController = async (req, res) => {
  await loginAdminServices(req, res);
};

export const updateSmtpController = async (req, res) => {
  await updateSmtpServices(req, res);
};

export const verifySmtpController = async (req, res) => {
  await verifySmtpServices(req, res);
};
