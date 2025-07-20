// config/dbManager.js
import mongoose from 'mongoose';
import crypto from 'crypto';

const connections = {}; // ✅ MUST be defined outside the function

export const loginUserConnectionBuild = async (adminId) => {
  if (connections[adminId]) {
    return connections[adminId];
  }

  // Safely create DB name
  let safeAdminId = adminId;
  const maxDbNameLength = 38 - 'admin_'.length;
  if (adminId.length > maxDbNameLength) {
    safeAdminId = crypto
      .createHash('sha1')
      .update(adminId)
      .digest('hex')
      .substring(0, maxDbNameLength);
  }

  const dbName = `admin_${safeAdminId}`;

  // ✅ Fix: Connect and wait for 'open'
  const checkConn = mongoose.createConnection(
    `${process.env.MONGO_URI_BASE}/admin?${process.env.MONGO_URI_OPTIONS}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  );

  await new Promise((resolve, reject) => {
    checkConn.once('open', resolve);
    checkConn.once('error', reject);
  });

  const dbAdmin = checkConn.db.admin();
  const dbs = await dbAdmin.listDatabases();
  // console.log('dbs name', dbs.databases[0].name);

  await checkConn.close();

  const exists = dbs.databases.some((db) => db.name === dbName);
  if (!exists) {
    throw new Error(`Enter correct Id`);
  }
  // ✅ connect only if DB exists
  const uri = `${process.env.MONGO_URI_BASE}/${dbName}?${process.env.MONGO_URI_OPTIONS}`;
  const conn = mongoose.createConnection(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  connections[adminId] = conn;
  return conn;
};
