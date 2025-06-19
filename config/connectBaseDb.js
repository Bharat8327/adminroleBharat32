import mongoose from 'mongoose';

export const connectBaseDB = async () => {
  try {
    const uri = `${process.env.MONGO_URI_BASE}/main?${process.env.MONGO_URI_OPTIONS}`;
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('connected to base MongoDb (for Admins)');
  } catch (error) {
    console.error('failed to connect to base mongoDB', error.message);
    process.exit(1);
  }
};
/*
    Issues and suggestions:
    1. The use of `useNewUrlParser` and `useUnifiedTopology` is no longer necessary in Mongoose 6+ as these options are true by default.
    2. Consider handling the case where environment variables are missing to avoid constructing an invalid URI.
    3. Avoid calling `process.exit(1)` in libraries; instead, throw the error or handle it at the application level.
    4. You may want to export the mongoose connection for reuse elsewhere.
*/
