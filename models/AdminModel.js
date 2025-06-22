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
  },
  { timestamps: true },
);

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
