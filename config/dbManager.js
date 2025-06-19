import mongoose from 'mongoose';
import crypto from 'crypto';

const connections = {}; // cache of connections

export const getAdminDBConnection = async (adminId) => {
  if (connections[adminId]) {
    return connections[adminId];
  }
  // Ensure the database name does not exceed 38 bytes
  let safeAdminId = adminId;
  const maxDbNameLength = 38 - 'admin_'.length;
  if (adminId.length > maxDbNameLength) {
    // Use a hash if adminId is too long
    safeAdminId = crypto
      .createHash('sha1')
      .update(adminId)
      .digest('hex')
      .substring(0, maxDbNameLength);
  }
  // Ensure options are appended as query parameters, not as part of the database name
  const uri = `${process.env.MONGO_URI_BASE}/admin_${safeAdminId}${
    process.env.MONGO_URI_OPTIONS
      ? '?' + process.env.MONGO_URI_OPTIONS.replace(/^\?/, '')
      : ''
  }`;
  const connection = mongoose.createConnection(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  connections[adminId] = connection;
  return connection;
};
