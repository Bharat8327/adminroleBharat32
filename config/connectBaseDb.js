import mongoose from 'mongoose';

export const connectBaseDB = async () => {
  const uri = `${process.env.MONGO_URI_BASE}/main?${process.env.MONGO_URI_OPTIONS}`;
  try {
    await mongoose.connect(uri, {});
    console.log('CONNECTED TO DATABASE SUCCESSFULLY');
  } catch (error) {
    console.error('COULD NOT CONNECT TO DATABASE:', error.message);
  }
};
