import { loginUserConnectionBuild } from '../config/AdminDBManager.js';
import { generateOtp, hashOtp, isOtpExpired } from '../utils/otp.js';
import { OTP_EMAIL_TEMPLATE } from '../utils/otpSenderTemplate.js';
import { errorResponse, successResponse } from '../utils/responseHelper.js';
import statusCode from '../utils/statusCode.js';
import Admin from '../models/AdminModel.js';
import message from '../utils/message.js';
import bcrypt from 'bcrypt';
import transporter from '../config/nodeMailer.js';
import { UserModel } from '../models/UserModel.js';

export const otpServices = async (req, res) => {
  const { email, Id } = req.body;
  try {
    if (email && !Id) {
      try {
        const admin = await Admin.findOne({ email }).select(
          '+resetOtp +resetOtpExpireAt',
        );

        if (!admin) {
          return errorResponse(res, statusCode.NOT_FOUND, message.NOT_FOUND);
        }
        const otp = generateOtp();
        const hashedOtp = hashOtp(otp);
        const otpExpire = Date.now() + 5 * 60 * 1000; // 5 mint

        admin.resetOtp = hashedOtp;
        admin.resetOtpExpireAt = otpExpire;

        const data = await admin.save();

        const mailOption = {
          from: `"Patell" <${process.env.SENDER_EMAIL}>`,
          to: email,
          subject: 'Password Reset Request – One-Time Password (OTP)',
          html: OTP_EMAIL_TEMPLATE.replace('{{otp}}', otp).replace(
            '{{supportLink}}',
            'http://localhost:4000/login',
          ),
        };
        await transporter.sendMail(mailOption);
        return successResponse(res, statusCode.OK, message.OTP, admin.email);
      } catch (error) {
        return errorResponse(res, statusCode.INTERNAL_ERROR, error.message);
      }
    } else if (!email || !Id) {
      return errorResponse(res, statusCode.FORBIDDEN, message.MISSING_FIELDS);
    } else {
      try {
        const adminId = Id;
        const conn = await loginUserConnectionBuild(adminId);
        const User = UserModel(conn);
        const existingUser = await User.findOne({ email }).select(
          '+resetOtp +resetOtpExpireAt',
        );
        if (!existingUser) {
          return errorResponse(res, statusCode.NOT_FOUND, message.NOT_FOUND);
        }

        const otp = generateOtp();
        const hashedOtp = hashOtp(otp);
        const otpExpire = Date.now() + 5 * 60 * 1000; // 5 mint
        existingUser.resetOtp = hashedOtp;
        existingUser.resetOtpExpireAt = otpExpire;
        existingUser.save();
        const mailOption = {
          from: `"Patell" <${process.env.SENDER_EMAIL}>`,
          to: email,
          subject: 'Password Reset Request – One-Time Password (OTP)',
          html: OTP_EMAIL_TEMPLATE.replace('{{otp}}', otp).replace(
            '{{supportLink}}',
            'http://localhost:4000/login',
          ),
        };
        const create = await transporter.sendMail(mailOption);
        return successResponse(
          res,
          statusCode.OK,
          message.OTP,
          existingUser.email,
        );
      } catch (error) {
        return errorResponse(res, statusCode.INTERNAL_ERROR, error.message);
      }
    }
  } catch (error) {
    return errorResponse(res, statusCode.INTERNAL_ERROR, error.message);
  }
};

export const otpVerifyServices = async (req, res) => {
  try {
    const { otp, email } = req.body;
    if (!otp || !email) {
      return errorResponse(res, statusCode.BAD_REQUEST, message.MISSING_FIELDS);
    }
    const admin = await Admin.findOne({ email }).select(
      '+resetOtp +resetOtpExpireAt',
    );
    if (!admin) {
      return errorResponse(res, statusCode.NOT_FOUND, message.NOT_FOUND);
    }
    const hashedOtp = hashOtp(otp);
    if (admin.resetOtp !== hashedOtp || isOtpExpired(admin.resetOtpExpireAt)) {
      return errorResponse(res, statusCode.BAD_REQUEST, message.INVALID_OTP);
    }
    return successResponse(
      res,
      statusCode.OK,
      message.OTP_VERIFY,
      'Otp verify',
    );
  } catch (error) {
    return errorResponse(res, statusCode.INTERNAL_ERROR, error.message);
  }
};

export const updatePasswordServices = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return errorResponse(res, statusCode.BAD_REQUEST, message.MISSING_FIELDS);
    }

    const admin = await Admin.findOne({ email }).select(
      '+resetOtp +resetOtpExpireAt +password',
    );

    if (!admin) {
      return errorResponse(res, statusCode.NOT_FOUND, message.NOT_FOUND);
    }
    if (admin.password === newPassword) {
      return errorResponse(res, statusCode.BAD_REQUEST, message.PASSWORD);
    }
    const hashedOtp = hashOtp(otp);
    if (admin.resetOtp !== hashedOtp || isOtpExpired(admin.resetOtpExpireAt)) {
      return errorResponse(res, statusCode.BAD_REQUEST, message.INVALID_OTP);
    }
    admin.password = await bcrypt.hash(newPassword, 10);
    admin.resetOtp = '';
    admin.resetOtpExpireAt = 0;
    await admin.save();
    return successResponse(
      res,
      statusCode.OK,
      message.UPDATE,
      'Password update successfully',
    );
  } catch (error) {
    return errorResponse(res, statusCode.INTERNAL_ERROR, error.message);
  }
};

// reset user password
export const userOtpVerificationServices = async (req, res) => {
  try {
    const { email, otp, Id } = req.body;

    if (!email || !otp || !Id) {
      return errorResponse(res, statusCode.BAD_REQUEST, message.MISSING_FIELDS);
    }

    const conn = await loginUserConnectionBuild(Id);
    const User = UserModel(conn);

    const existingUser = await User.findOne({ email }).select(
      '+resetOtp +resetOtpExpireAt',
    );

    if (!existingUser) {
      return errorResponse(res, statusCode.NOT_FOUND, message.NOT_FOUND);
    }

    const hashedOtp = hashOtp(otp);
    if (
      existingUser.resetOtp !== hashedOtp ||
      isOtpExpired(existingUser.resetOtpExpireAt)
    ) {
      return errorResponse(res, statusCode.BAD_REQUEST, message.INVALID_OTP);
    }

    return successResponse(
      res,
      statusCode.OK,
      message.OTP_VERIFY,
      'OTP verified',
    );
  } catch (error) {
    return errorResponse(res, statusCode.INTERNAL_ERROR, error.message);
  }
};

// update user password
export const userPasswordUpdate = async (req, res) => {
  try {
    const { email, otp, newPassword, Id } = req.body;

    if (!email || !otp || !newPassword || !Id) {
      return errorResponse(res, statusCode.BAD_REQUEST, message.MISSING_FIELDS);
    }

    const conn = await loginUserConnectionBuild(Id);
    const User = UserModel(conn);

    const existingUser = await User.findOne({ email }).select(
      '+resetOtp +resetOtpExpireAt +password',
    );

    if (!existingUser) {
      return errorResponse(res, statusCode.NOT_FOUND, message.NOT_FOUND);
    }

    if (await bcrypt.compare(newPassword, existingUser.password)) {
      return errorResponse(res, statusCode.BAD_REQUEST, message.PASSWORD);
    }

    const hashedOtp = hashOtp(otp);
    if (
      existingUser.resetOtp !== hashedOtp ||
      isOtpExpired(existingUser.resetOtpExpireAt)
    ) {
      return errorResponse(res, statusCode.BAD_REQUEST, message.INVALID_OTP);
    }

    existingUser.password = await bcrypt.hash(newPassword, 10);
    existingUser.resetOtp = '';
    existingUser.resetOtpExpireAt = 0;

    await existingUser.save();

    return successResponse(
      res,
      statusCode.OK,
      message.UPDATE,
      'Password updated successfully',
    );
  } catch (error) {
    return errorResponse(res, statusCode.INTERNAL_ERROR, error.message);
  }
};
