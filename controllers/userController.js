import {
  getAllUsersForAdmin,
  createUserForAdmin,
} from '../services/userServices.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';
import statusCode from '../utils/statusCode.js';
import message from '../utils/message.js';
import Admin from '../models/AdminModel.js';
import mongoose from 'mongoose';
import { resetPasswordServices } from '../services/userServices.js';

export const createUser = async (req, res) => {
  try {
    console.log('comes inside createCOntroller');

    const user = await createUserForAdmin(req, res);
    return successResponse(res, statusCode.CREATED, message.USER_CREATED, user);
  } catch (error) {
    return errorResponse(res, statusCode.INTERNAL_ERROR, error.message);
  }
};

export const getUser = async (req, res) => {
  try {
    const adminId = req.user;
    const users = await getAllUsersForAdmin(adminId);
    if (!users || users.length === 0) {
      return successResponse(res, statusCode.OK, message.NOT_FOUND, []);
    }
    console.log('comes', users);

    return successResponse(res, statusCode.OK, message.USERS_FETCHED, users);
  } catch (error) {
    console.log('comes error');

    return errorResponse(res, statusCode.INTERNAL_ERROR, error.message);
  }
};

export const passwordRest = async (req, res) => {
  await resetPasswordServices(req, res);
};
