import { getAdminDBConnection } from '../config/dbManager.js';
import { UserModel } from '../models/UserModel.js';

export const createUserForAdmin = async (adminId, userData) => {
  const conn = await getAdminDBConnection(adminId);
  const User = UserModel(conn);
  console.log(userData);

  const existingUser = await User.findOne({ userName: userData.userName });
  if (existingUser) {
    throw new Error(
      `User with userName "${userData.userName}" already exists.`,
    );
  }
  const newUser = await User.create(userData);
  return newUser;
};

export const getAllUsersForAdmin = async (adminId) => {
  const conn = await getAdminDBConnection(adminId);
  const User = UserModel(conn);
  return await User.find();
};
