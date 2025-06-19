import {
  createAdmin,
  // createUserService,
  getAllAdmins,
  // getAllUsersService,
  // loginAdmin,
} from '../services/adminServices.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';
import status from '../utils/statusCode.js';
import msg from '../utils/message.js';
import message from '../utils/message.js';

// export const createUser = async (req, res) => {
//   try {
//     console.log(req.admin._id);
//     const user = await createUserService(req.body, req.admin._id.toString());
//     return successResponse(res, status.CREATED, msg.USER_CREATED, user);
//   } catch (error) {
//     return errorResponse(res, status.INTERNAL_ERROR, error.message);
//   }
// };

// export const getAllUsers = async (req, res) => {
//   try {
//     const users = await getAllUsersService();
//     return successResponse(res, status.OK, msg.USERS_FETCHED, users);
//   } catch (error) {
//     return errorResponse(res, status.INTERNAL_ERROR, error.message);
//   }
// };

//1st

export const AdminCreate = async (req, res) => {
  try {
    const admin = await createAdmin(req);
    return successResponse(res, status.CREATED, msg.USER_CREATED, admin);
  } catch (error) {
    return errorResponse(res, status.INTERNAL_ERROR, error.message);
  }
};
//2nd
export const listAdmins = async (req, res) => {
  try {
    const admins = await getAllAdmins();
    return successResponse(res, status.OK, message.USERS_FETCHED, admins);
  } catch (error) {
    return errorResponse(res, status.INTERNAL_ERROR, err.message);
  }
};

// export const AdminLogin = async (req, res) => {
//   try {
//     const adminLogin = await loginAdmin(req, res);
//     return successResponse(res, status.OK, msg.OK, adminLogin);
//   } catch (error) {
//     return errorResponse(res, status.INTERNAL_ERROR, error.message);
//   }
// };
