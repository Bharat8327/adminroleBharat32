import Admin from '../models/AdminModel.js';
import { getAdminDBConnection } from '../config/dbManager.js';
import message from '../utils/message.js';
import { errorResponse, successResponse } from '../utils/responseHelper.js';
import bcrypt from 'bcrypt';
import statusCode from '../utils/statusCode.js';

export const createAdmin = async (req, res) => {
  try {
    const { userName, email, password, mobileNo, Id } = req.body;

    if (!userName || !email || !password || !mobileNo || !Id) {
      return errorResponse(res, statusCode.BAD_REQUEST, message.MISSING_FIELDS);
    }

    // Check for existing email
    const isExist = await Admin.findOne({ email });
    if (isExist) {
      return errorResponse(
        res,
        statusCode.FORBIDDEN,
        message.ALREADY_REGISTERED,
      );
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newAdmin = await Admin.create({
      userName,
      email,
      password: hashPassword,
      mobileNo,
      Id,
    });

    return successResponse(res, statusCode.CREATED, message.USER_CREATED, {
      userName,
      email,
    });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      const value = err.keyValue[field];
      return errorResponse(
        res,
        statusCode.CONFLICT,
        `${field} already exists. Please choose another.`,
      );
    }

    return errorResponse(res, statusCode.INTERNAL_ERROR, err.message);
  }
};

// get all admins
export const getAllAdmins = async () => {
  return await Admin.find();
};
