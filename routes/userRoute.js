import express from 'express';
import { loginUserController } from '../controllers/authController.js';

const routes = express.Router();

// user login
routes.post('/u/login', loginUserController);

export default routes;
