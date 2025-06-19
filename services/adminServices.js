import Admin from '../models/AdminModel.js';
import User from '../models/AdminModel.js';
import bcrypt from 'bcrypt';

export const createUserService = async (userData, admin) => {
  const { name, email } = userData;
  if (!name || !email) throw new Error('Name and Email are required');

  const newUser = await User.create({ name, email, createdBy: admin._id });
  await newUser.save();
  return newUser;
};

export const getAllUsersService = async () => {
  return await User.find().populate('createdBy', 'name email');
};

export const createAdmin = async (req) => {
  const { name, email, password, mobileNo } = req.body;
  if (!name || !email || !password || !mobileNo) {
    throw new Error('All fields are required');
  }

  const isExist = await Admin.findOne({ email });
  if (isExist) {
    throw new Error('User already registered');
  }
  const hashPassword = await bcrypt.hash(password, 11);
  const adminCreate = await Admin.create({
    name,
    email,
    password: hashPassword,
    mobileNo,
  });
  await adminCreate.save();
  return adminCreate;
};

export const loginAdmin = async (req) => {
  const { email, password, mobileNo } = req.body;

  if (!email || !password || !mobileNo) {
    throw new Error('All fields are required');
  }

  const isExist = await Admin.findOne({ email }).select('+password');
  if (!isExist) {
    throw new Error('User is not Exist');
  }
  const isMatch = await bcrypt.compare(password, isExist.password);

  const token = gernreateWebToken({
    _id: isMatch._id,
    phone: isMatch.phone,
    email: isMatch.email,
    mobileNo,
  });

  const refreshToken = gernateRefreshTOken({
    _id: isMatch._id,
    phone: isMatch.phone,
    mobileNo,
    email: isMatch.email,
  });
  return refreshToken;
};

const gernreateWebToken = (data) => {
  try {
    const token = jwt.sign(data, process.env.ACESS_TOKEN_PRIVATE_KEY, {
      expiresIn: '1d',
    });
    return token;
  } catch (err) {
    console.log(err.message);
  }
};

const gernateRefreshTOken = (data) => {
  try {
    const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
      expiresIn: '1y',
    });
    return token;
  } catch (err) {
    console.log(err.message);
  }
};
