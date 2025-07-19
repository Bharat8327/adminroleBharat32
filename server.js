import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { connectBaseDB } from './config/connectBaseDb.js';
import admin from './routes/adminRoute.js';
import user from './routes/userRoute.js';
import { handleGeminiStream } from './controllers/geminiController.js';

dotenv.config();

const app = express();
const server = createServer(app);

// ✅ Setup for Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4000', // your frontend URL or "*" in production
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
  handleGeminiStream(socket); // custom stream handler
});

// ✅ Directory resolution for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Middleware
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:4000',
    credentials: true,
  }),
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ✅ Serve static files (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Render routes for EJS frontend
app.get('/', (req, res) => res.render('index'));
app.get('/login', (req, res) => res.render('employeeLogin'));
app.get('/loginadmin', (req, res) => res.render('adminLogin'));
app.get('/dashboard', (req, res) => res.render('adminDashboard'));
app.get('/u/dashboard', (req, res) => res.render('userDashboard'));
app.get('/createaccount', (req, res) => res.render('adminCreate'));
app.get('/forgot', (req, res) => res.render('forgotPasswd'));
app.get('/email-history', (req, res) => res.render('email_history'));

// ✅ API Routes
connectBaseDB(); // connects MongoDB
app.use('/admin', admin);
app.use('/user', user);

// ✅ 404 Page
app.use((req, res) => {
  res.status(404).render('404', {
    url: req.originalUrl,
    title: 'Page Not Found',
  });
});

// ✅ Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
