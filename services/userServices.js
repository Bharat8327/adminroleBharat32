import { getAdminDBConnection } from '../config/dbManager.js';
import { UserModel } from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import { errorResponse } from '../utils/responseHelper.js';
import statusCode from '../utils/statusCode.js';
import message from '../utils/message.js';
import Admin from '../models/AdminModel.js';

export const createUserForAdmin = async (adminId, req, res) => {
  try {
    const { email, userName, password, mobileNo } = req.body;

    // Validate input
    if (!email || !userName || !password || !mobileNo) {
      return errorResponse(res, statusCode.BAD_REQUEST, message.MISSING_FIELDS);
    }

    // 1. Get correct admin DB
    const isExist = await Admin.findById(adminId);
    if (!isExist) {
      return errorResponse(res, statusCode.NOT_FOUND, message.NOT_FOUND);
    }

    const conn = await getAdminDBConnection(req.admin.Id);
    const User = UserModel(conn);

    // 2. Check if user already exists in admin's DB
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(
        res,
        statusCode.CONFLICT,
        message.ALREADY_REGISTERED,
      );
    }

    // 3. Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      userName,
      password: hashedPassword,
      mobileNo,
    });

    return newUser;
  } catch (err) {
    return errorResponse(res, statusCode.INTERNAL_ERROR, err.message);
  }
};

export const getAllUsersForAdmin = async (adminId) => {
  const conn = await getAdminDBConnection(adminId);
  const User = UserModel(conn);
  const users = await User.find();
  return users;
};
