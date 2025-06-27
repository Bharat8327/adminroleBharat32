import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    mobileNo: { type: String, required: true },
    role: {
      type: String,
      default: 'user',
    },
    verifyOtp: {
      type: String,
      default: '',
      select: false,
    },
    verifyOtpExpireAt: {
      type: Number,
      default: 0,
      select: false,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    // reset otp
    resetOtp: {
      type: String,
      default: '',
      select: false,
    },
    resetOtpExpireAt: {
      type: Number,
      default: 0,
      select: false,
    },
  },
  { timestamps: true },
);

export const UserModel = (connection) => {
  return connection.model('User', userSchema);
};
