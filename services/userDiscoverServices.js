// import Admin from '../models/Admin.js';
// import { getAdminDBConnection } from '../config/dbManager.js';
// import { UserModel } from '../models/UserModel.js';

// export const findUserInAnyAdminDB = async (email) => {
//   const admins = await Admin.find(); // all admins from main DB

//   for (const admin of admins) {
//     const conn = await getAdminDBConnection(admin._id.toString());
//     const User = UserModel(conn);
//     const user = await User.findOne({ email });

//     if (user) {
//       return {
//         user,
//         adminId: admin._id,
//       };
//     }
//   }

//   return null; // not found in any DB
// };
