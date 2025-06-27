import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobileNo: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      select: false,
      required: true,
    },
    Id: {
      type: String,
      unique: true,
      required: true,
    },
    // reset Otp
    verifyOtp: {
      type: String,
      default: '',
      select: false,
    },
    resetOtpExpireAt: {
      type: Number,
      default: 0,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },

    // reset otp
    resetOtp: {
      type: String,
      default: '',
    },
    resetOtpExpireAt: {
      type: Number,
      default: 0,
      select: false,
    },
  },
  { timestamps: true },
);

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
