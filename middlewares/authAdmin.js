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
  console.log('comes inside middleware1');

  const token = req.headers.authorization.split(' ')[1];
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log('decode the code', decode);
    if (!decode) {
      return errorResponse(
        res,
        statusCode.BAD_REQUEST,
        message.AUTH_TOKEN_REQUIRED,
      );
    }
    console.log('comes inside middleware2');

    req.user = decode.Id;
  } catch (err) {
    return errorResponse(res, statusCode.BAD_REQUEST, err.message);
  }
  console.log('comes inside middleware3');

  next();
};
export default isAdmin;
