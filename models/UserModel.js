import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  mobileNo: { type: String, required: true },
  role: { type: String, default: 'user' },

  verifyOtp: { type: String, default: '', select: false },
  verifyOtpExpireAt: { type: Number, default: 0, select: false },
  isAccountVerified: { type: Boolean, default: false },

  resetOtp: { type: String, default: '', select: false },
  resetOtpExpireAt: { type: Number, default: 0, select: false },

  smtp: {
    host: { type: String, default: 'smtp.gmail.com' },
    port: { type: Number, default: 465 },
    user: { type: String },
    pass: { type: String, select: false },
  },
  emailHistory: [
    {
      recipientEmail: { type: String, required: true },
      subjects: [String],
      count: { type: Number, default: 1 },
      body: [String],
      lastSentAt: { type: Date, default: Date.now },
    },
  ],
});

export const UserModel = (connection) => {
  return connection.model('User', userSchema);
};
