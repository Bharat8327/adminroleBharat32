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

app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:4000',
    credentials: true,
  }),
);
app.use(morgan('dev'));
app.use(express.json());

const server = createServer(app);

const io = new Server(server);

io.on('connection', (Socket) => {
  // console.log('socket.io connected successfully', Socket.id);
  handleGeminiStream(Socket);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup EJS views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => res.render('index'));
app.get('/login', (req, res) => res.render('employeeLogin'));
app.get('/loginadmin', (req, res) => res.render('adminLogin'));
app.get('/dashboard', (req, res) => res.render('adminDashboard'));
app.get('/u/dashboard', (req, res) => res.render('userDashboard'));
app.get('/createaccount', (req, res) => res.render('adminCreate'));
app.get('/forgot', (req, res) => res.render('forgotPasswd'));
app.get('/email-history', (req, res) => res.render('email_history'));

// DB + Routers
connectBaseDB();

app.use('/admin', admin);
app.use('/user', user);

// 404 handler (must come after all other routes)
app.use((req, res) => {
  res.status(404).render('404', {
    url: req.originalUrl,
    title: 'Page Not Found',
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  // console.log(`Server is running on http://localhost:${PORT}`);
});
