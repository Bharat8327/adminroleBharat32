import mongoose from 'mongoose';

const adminSchema = mongoose.Schema({
  name: {
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
  role: {
    type: String,
    default: 'Admin',
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

export default mongoose.model('Admin', adminSchema);
