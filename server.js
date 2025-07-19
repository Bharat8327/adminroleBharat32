import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import admin from './routes/adminRoute.js';
import user from './routes/userRoute.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { connectBaseDB } from './config/connectBaseDb.js';
import { createServer } from 'http';
import { handleGeminiStream } from './controllers/geminiController.js';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4000', // ✅ your frontend origin
    credentials: true,
  },
});

// ✅ Socket.io
io.on('connection', (socket) => {
  console.log('Socket.io connected successfully:', socket.id);
  handleGeminiStream(socket);
});

// ✅ Resolve directory paths (for ES modules)
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

// ✅ Set EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ✅ Static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Routes (EJS Views)
app.get('/', (req, res) => res.render('index'));
app.get('/login', (req, res) => res.render('employeeLogin'));
app.get('/loginadmin', (req, res) => res.render('adminLogin'));
app.get('/dashboard', (req, res) => res.render('adminDashboard'));
app.get('/u/dashboard', (req, res) => res.render('userDashboard'));
app.get('/createaccount', (req, res) => res.render('adminCreate'));
app.get('/forgot', (req, res) => res.render('forgotPasswd'));
app.get('/email-history', (req, res) => res.render('email_history'));

// ✅ API Routes
connectBaseDB();
app.use('/admin', admin);
app.use('/user', user);

// ✅ 404 page
app.use((req, res) => {
  res.status(404).render('404', {
    url: req.originalUrl,
    title: 'Page Not Found',
  });
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
