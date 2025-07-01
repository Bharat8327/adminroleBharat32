import jwt from 'jsonwebtoken';
import statusCode from '../utils/statusCode.js';
import { errorResponse } from '../utils/responseHelper.js';
import message from '../utils/message.js';
import { getAdminDBConnection } from '../config/dbManager.js';
import { UserModel } from '../models/UserModel.js';

const authUser = async (req, res, next) => {
  if (
    !req.headers ||
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer ')
  ) {
    return errorResponse(
      res,
      statusCode.BAD_REQUEST,
      message.AUTH_TOKEN_REQUIRED,
    );
  }
  const token = req.headers.authorization.split(' ')[1];
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode) {
      return errorResponse(
        res,
        statusCode.BAD_REQUEST,
        message.AUTH_TOKEN_INVALID,
      );
    }

    const conn = await getAdminDBConnection(decode.Id);
    const User = UserModel(conn);

    req.user = await User.findOne({ email: decode.email }).select(
      '+password +smtp.pass',
    );
    if (req.user === null || !req.user) {
      throw new Error('Unauthorized User');
    }

    req.adminId = decode.Id;
  } catch (error) {
    return errorResponse(res, statusCode.BAD_REQUEST, error.message);
  }
  next();
};

export default authUser;
