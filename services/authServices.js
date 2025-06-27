// services/authServices.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { loginUserConnectionBuild } from '../config/AdminDBManager.js';
import { UserModel } from '../models/UserModel.js';
import statusCode from '../utils/statusCode.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';
import message from '../utils/message.js';
import Admin from '../models/AdminModel.js';

export const loginUserService = async (req, res) => {
  const { email, password, Id } = req.body;

  if (!email || !password || !Id) {
    return errorResponse(res, statusCode.BAD_REQUEST, message.MISSING_FIELDS);
  }

  // Step 1: Find adminId from meta DB
  const adminId = Id;

  try {
    const conn = await loginUserConnectionBuild(adminId);
    const User = UserModel(conn);

    const existingUser = await User.findOne({ email }).select('+password');
    if (!existingUser || existingUser === null) {
      return errorResponse(res, statusCode.NOT_FOUND, message.NOT_FOUND);
    }
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return errorResponse(
        res,
        statusCode.UNAUTHORIZED,
        message.INVALID_CREDENTIALS,
      );
    }

    // Step 4: Generate JWT
    const token = await generateToken({
      userId: existingUser._id,
      adminId,
      email,
      Id,
    });

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });

    return successResponse(res, statusCode.OK, message.LOGIN, {
      token,
      user: {
        id: existingUser._id,
        email: existingUser.email,
        userName: existingUser.userName,
      },
    });
  } catch (error) {
    return errorResponse(res, statusCode.INTERNAL_ERROR, error.message);
  }
};

export const loginAdminServices = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return errorResponse(res, statusCode.BAD_REQUEST, message.MISSING_FIELDS);
    }
    const existingUser = await Admin.findOne({ email }).select('+password');
    if (!existingUser) {
      return errorResponse(
        res,
        statusCode.CONFLICT,
        message.INVALID_CREDENTIALS,
      );
    }
    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return errorResponse(res, statusCode.UNAUTHORIZED, 'Invalid credentials');
    }
    // Step 4: Generate JWT
    const token = await generateToken({ email, _id: existingUser._id });
    return successResponse(res, statusCode.OK, message.LOGIN, {
      token,
      user: {
        id: existingUser._id,
        email: existingUser.email,
        userName: existingUser.userName,
        adminId: existingUser.Id,
      },
    });
  } catch (error) {
    return errorResponse(
      res,
      statusCode.INTERNAL_ERROR,
      statusCode.INTERNAL_ERROR,
    );
  }
};

const generateToken = async (data) => {
  try {
    const token = await jwt.sign(data, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    return token;
  } catch (error) {
    console.log(error.message);
  }
};
