import statusCode from '../utils/statusCode.js';
import message from '../utils/message.js';
import jwt from 'jsonwebtoken';
import { errorResponse } from '../utils/responseHelper.js';

const isAdmin = async (req, res, next) => {
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
        message.AUTH_TOKEN_REQUIRED,
      );
    }

    req.user = decode.Id;
  } catch (err) {
    return errorResponse(res, statusCode.BAD_REQUEST, err.message);
  }
  next();
};
export default isAdmin;
