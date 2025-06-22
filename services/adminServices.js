import Admin from '../models/AdminModel.js';
import { getAdminDBConnection } from '../config/dbManager.js';
import message from '../utils/message.js';
import { errorResponse, successResponse } from '../utils/responseHelper.js';
import bcrypt from 'bcrypt';
import statusCode from '../utils/statusCode.js';
import { AdminCreate } from '../controllers/adminController.js';

export const createAdmin = async (req, res) => {
  try {
    const { userName, email, password, mobileNo, Id } = req.body;

    if (!userName || !email || !password || !mobileNo || !Id) {
      return errorResponse(res, statusCode.BAD_REQUEST, message.MISSING_FIELDS);
    }

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

    // create dynamic database when Admin create
    // const admindata = await AdminCreate(newAdmin._id);
    // console.log('hello admindata', admindata);

    return successResponse(res, statusCode.CREATED, message.USER_CREATED, {
      userName,
      email,
    });
  } catch (err) {
    return errorResponse(res, statusCode.INTERNAL_ERROR, err.message);
  }
};

// get all admins
export const getAllAdmins = async () => {
  return await Admin.find();
};
