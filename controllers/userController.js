import {
  getAllUsersForAdmin,
  createUserForAdmin,
} from '../services/userServices.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';
import statusCode from '../utils/statusCode.js';
import message from '../utils/message.js';

export const createUser = async (req, res) => {
  try {
    const { adminId } = req.params;
    const user = await createUserForAdmin(adminId, req.body);
    return successResponse(res, statusCode.CREATED, message.USER_CREATED, user);
  } catch (error) {
    return errorResponse(res, statusCode.INTERNAL_ERROR, error);
  }
};

export const getUser = async (req, res) => {
  try {
    const { adminId } = req.params;
    const user = await getAllUsersForAdmin(adminId);
    return successResponse(res, statusCode.OK, message.USERS_FETCHED, user);
  } catch (error) {
    return errorResponse(res, statusCode.INTERNAL_ERROR, error.message);
  }
};
