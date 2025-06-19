import Admin from '../models/AdminModel.js';

export const isAdmin = async (req, res, next) => {
  // In real-world: use JWT
  const adminId = req.headers;
  if (!adminId) return res.status(401).json({ message: 'Admin ID required' });

  const admin = await Admin.findById(adminId);
  if (!admin) return res.status(403).json({ message: 'Invalid admin' });

  req.admin = admin;
  next();
};
