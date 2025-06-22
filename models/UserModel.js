import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobileNo: { type: String, required: true },
    role: {
      type: String,
      default: 'user',
    },
  },
  { timestamps: true },
);

export const UserModel = (connection) => {
  return connection.model('User', userSchema);
};
