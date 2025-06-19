import express from 'express';
import {
  createUser,
  getAllUsers,
  AdminCreate,
  AdminLogin,
} from '../controllers/adminController.js';
import { isAdmin } from '../middlewares/auth.js';

const routes = express.Router();

routes.post('/admin/create-user', isAdmin, createUser);
routes.get('/admin/users', isAdmin, getAllUsers);

routes.post('/register', AdminCreate);
routes.post('/login', AdminLogin);

export default routes;
