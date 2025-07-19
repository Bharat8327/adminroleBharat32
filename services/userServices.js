import { getAdminDBConnection } from '../config/dbManager.js';
import { UserModel } from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import { errorResponse, successResponse } from '../utils/responseHelper.js';
import statusCode from '../utils/statusCode.js';
import message from '../utils/message.js';
import Admin from '../models/AdminModel.js';
import { USER_CREATED_TEMPLATE } from '../config/emailTemplate.js';
import nodemailer from 'nodemailer';
import { decrypt } from '../utils/Encrypt_decrypt.js';

export const createUserForAdmin = async (req, res) => {
  try {
    const { email, userName, mobileNo } = req.body;

    // Validate input
    if (!email || !userName || !mobileNo) {
      return errorResponse(res, statusCode.BAD_REQUEST, message.MISSING_FIELDS);
    }

    const currentYear = new Date().getFullYear();
    const formattedName =
      userName[0].toUpperCase() + userName.slice(1).toLowerCase();

    const password = `${formattedName}@${currentYear}`;

    // 1. Get correct admin DB
    const isExist = await Admin.findById(req.params.adminId).select(
      '+smtp.pass',
    );

    if (!isExist) {
      return errorResponse(res, statusCode.NOT_FOUND, message.NOT_FOUND);
    }

    const conn = await getAdminDBConnection(isExist.Id);
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

    const decryptedPass = decrypt(isExist.smtp.pass);
    let transport = nodemailer.createTransport({
      host: isExist.smtp.host,
      port: isExist.smtp.port,
      auth: {
        user: isExist.smtp.user,
        pass: decryptedPass,
      },
    });

    const mailOption = {
      from: `"Patell" <${isExist.smtp.user}>`,
      to: email,
      subject: `Account Created Successfully by ${isExist.userName}`,
      html: USER_CREATED_TEMPLATE.replace('{{username}}', userName)
        .replace('{{email}}', email)
        .replace('{{password}}', password)
        .replace('{{loginLink}}', 'https://yourdomain.com/login')
        .replace('{{id}}', isExist.Id),
    };

    try {
      await transport.sendMail(mailOption);
    } catch (mailErr) {
      // Check for invalid login error
      if (
        mailErr &&
        mailErr.message &&
        mailErr.message.includes('Invalid login')
      ) {
        // Send error response with suggestion to update SMTP credentials
        return errorResponse(
          res,
          statusCode.UNAUTHORIZED,
          'Invalid SMTP credentials. Please update your SMTP email and password in the admin settings.',
        );
      }
      // Other email errors
      return errorResponse(
        res,
        statusCode.INTERNAL_ERROR,
        `Failed to send email: ${mailErr.message}`,
      );
    }

    return successResponse(res, statusCode.CREATED, message.CREATED, newUser);
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

export const resetPasswordServices = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return errorResponse(res, statusCode.FORBIDDEN, message.MISSING_FIELDS);
    }
    const adminId = req.adminId;
    const conn = await getAdminDBConnection(adminId);
    const User = UserModel(conn);

    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await User.findOneAndUpdate(
      { email: req.user.email },
      { password: hashedPassword },
      { new: true },
    );
    if (!updatedUser) {
      return errorResponse(res, statusCode.NOT_FOUND, message.NOT_FOUND);
    }
    return successResponse(res, statusCode.OK, message.UPDATE, updatedUser);
  } catch (error) {
    return errorResponse(res, statusCode.INTERNAL_ERROR, error.message);
  }
};
