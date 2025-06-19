import Admin from '../models/AdminModel.js';
import { getAdminDBConnection } from '../config/dbManager.js';
import message from '../utils/message.js';
import status from '../utils/statusCode.js';
import { errorResponse } from '../utils/responseHelper.js';
import bcrypt from 'bcrypt';

export const createAdmin = async (req, res) => {
  try {
    const { userName, email, password, mobileNo } = req.body;
    if (!userName || !email || !password || !mobileNo) {
      if (res)
        return errorResponse(res, status.BAD_REQUEST, message.MISSING_FIELDS);
      throw new Error(message.MISSING_FIELDS);
    }
    const isExist = await Admin.findOne({ email });
    if (isExist) {
      if (res)
        return errorResponse(
          res,
          status.BAD_REQUEST,
          message.ALREADY_REGISTERED,
        );
      throw new Error(message.ALREADY_REGISTERED);
    }
    const hashPassword = await bcrypt.hash(password, 11);

    const newAdmin = await Admin.create({
      userName,
      email,
      password: hashPassword,
      mobileNo,
    });
    await getAdminDBConnection(newAdmin._id);
    if (res) return res.status(status.SUCCESS).json(newAdmin);
    return newAdmin;
  } catch (err) {
    if (res) return errorResponse(res, status.INTERNAL_ERROR, err.message);
    throw err;
  }
};

export const getAllAdmins = async () => {
  return await Admin.find();
};

// export const loginAdmin = async (req) => {
//   try {
//     const { email, password, mobileNo } = req.body;

//     if (!email || !password || !mobileNo) {
//       return errorResponse(res, status.MISSING_FIELDS, message.MISSING_FIELDS);
//     }

//     const isExist = await Admin.findOne({ email }).select('+password');
//     if (!isExist) {
//       return errorResponse(res, status.NOT_FOUND, message.NOT_FOUND);
//     }
//     const isMatch = await bcrypt.compare(password, isExist.password);
//     console.log(isExist);

//     const token = gernreateWebToken({
//       _id: isExist._id,
//       phone: isExist.phone,
//       email: isExist.email,
//       mobileNo,
//     });

//     const refreshToken = gernateRefreshTOken({
//       _id: isExist._id,
//       phone: isExist.phone,
//       mobileNo,
//       email: isExist.email,
//     });
//     return { token };
//   } catch (error) {
//     return errorResponse(res, status.INTERNAL_ERROR, error.message);
//   }
// };

// export const createUserService = async (userData, admin) => {
//   const { userName, email, password, mobileNo } = userData;
//   if (!userName || !email || !password || !mobileNo) {
//     return errorResponse(res, status.BAD_REQUEST, message.MISSING_FIELDS);
//   }
//   const hashPassword = await bcrypt.hash(password, 10);
//   const dbName = `user_${userName.toLowerCase()}`;
//   const userConnection = await getAdminDBConnection(dbName);
//   const User = UserModel(userConnection);
//   const newUser = await User.create({
//     userName,
//     email,
//     password: hashPassword,
//     mobileNo,
//     createdBy: admin,
//   });
//   return newUser;
// };
// export const getAllUsersService = async () => {
//   return await UserModel.find().populate('createdBy', 'name email');
// };

// const gernreateWebToken = (data) => {
//   try {
//     const token = jwt.sign(data, process.env.ACESS_TOKEN_PRIVATE_KEY, {
//       expiresIn: '1d',
//     });
//     return token;
//   } catch (err) {
//     console.log(err.message);
//   }
// };

// const gernateRefreshTOken = (data) => {
//   try {
//     const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
//       expiresIn: '1y',
//     });
//     return token;
//   } catch (err) {
//     console.log(err.message);
//   }
// };
