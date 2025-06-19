import Admin from '../models/AdminModel.js';
import { UserModel } from '../models/UserModel.js';
import status from '../utils/statusCode.js';
import message from '../utils/message.js';
import jwt from 'jsonwebtoken';
import { errorResponse } from '../utils/responseHelper.js';

export const isAdmin = async (req, res, next) => {
  if (
    !req.headers ||
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer ')
  ) {
    return errorResponse(res, status.BAD_REQUEST, message.AUTH_TOKEN_REQUIRED);
  }

  const token = req.headers.authorization.split(' ')[1];
  try {
    const decode = jwt.verify(token, process.env.ACESS_TOKEN_PRIVATE_KEY);
    req.admin = await Admin.findById(decode._id);
  } catch (err) {
    console.log('comes');
    return errorResponse(res, status.BAD_REQUEST, err.message);
  }
  next();
};
