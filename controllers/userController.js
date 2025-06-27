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
    const { adminId } = req.params;

    const user = await createUserForAdmin(adminId, req, res);
    return successResponse(res, statusCode.CREATED, message.USER_CREATED, user);
  } catch (error) {
    return errorResponse(res, statusCode.INTERNAL_ERROR, error.message);
  }
};

export const getUser = async (req, res) => {
  try {
    let { adminId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(adminId)) {
      throw new Error('Invalid admin ID format');
    }
    const isAdmin = await Admin.findById(adminId);
    if (!isAdmin) {
      throw new Error('Admin not found');
    }
    const Id = isAdmin.Id;
    adminId = Id;

    const users = await getAllUsersForAdmin(adminId);

    if (!users || users.length === 0) {
      return successResponse(res, statusCode.OK, message.NOT_FOUND, []);
    }
    return successResponse(res, statusCode.OK, message.USERS_FETCHED, users);
  } catch (error) {
    return errorResponse(res, statusCode.INTERNAL_ERROR, error.message);
  }
};

export const passwordRest = async (req, res) => {
  await resetPasswordServices(req, res);
};
