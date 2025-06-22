import {
  loginAdminServices,
  loginUserService,
} from '../services/authServices.js';

export const loginUserController = async (req, res) => {
  await loginUserService(req, res);
};

export const loginAdminController = async (req, res) => {
  await loginAdminServices(req, res);
};
