import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import routes from './routes/adminRoute.js';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();

app.use(cookieParser());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  return res.status(200).send('server is start');
});

app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});

/*
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productPost.js';
import wishlistRoute from './routes/wishListRoute.js';
import connectMongodb from './config/db.js';

dotenv.config();
const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:5174',
    credentials: true, // if using cookies or sessions
  }),
);
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
  return res.status(200).send('server is start');
});

app.use('/auth', authRoutes);
app.use('/p', productRoutes);
app.use('/prod', wishlistRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectMongodb();
});
*/
