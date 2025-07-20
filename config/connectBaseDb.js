import mongoose from 'mongoose';

export const connectBaseDB = async () => {
  const uri = `${process.env.MONGO_URI_BASE}/main?${process.env.MONGO_URI_OPTIONS}`;
  try {
    await mongoose.connect(uri, {});
  } catch (error) {
    console.error('COULD NOT CONNECT TO DATABASE:', error.message);
  }
};

export const messageDb = async () => {
  const uri = process.env.MESSAGE_URI;
  try {
    await mongoose.connect(uri, {});
  } catch (error) {
    console.error('COULD NOT CONNECT TO DATABASE:', error.message);
  }
};
