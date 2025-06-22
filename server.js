import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import admin from './routes/adminRoute.js';
import user from './routes/userRoute.js';
import cookieParser from 'cookie-parser';
import { connectBaseDB } from './config/connectBaseDb.js';

dotenv.config();
const app = express();

app.use(cookieParser());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

const PORT = process.env.PORT || 3000;

connectBaseDB();
app.use('/admin', admin);
app.use('/user', user);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
