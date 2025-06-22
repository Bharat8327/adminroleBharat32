import { createAdmin, getAllAdmins } from '../services/adminServices.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';
import statusCode from '../utils/statusCode.js';
import message from '../utils/message.js';

//1st
export const AdminCreate = async (req, res) => {
  await createAdmin(req, res);
};

//2nd
export const listAdmins = async (req, res) => {
  try {
    const admins = await getAllAdmins();
    return successResponse(res, statusCode.OK, message.USERS_FETCHED, admins);
  } catch (error) {
    return errorResponse(res, statusCode.INTERNAL_ERROR, err.message);
  }
};
