import express from 'express';
// import {
//   createUser,
//   getAllUsers,
//   AdminCreate,
//   AdminLogin,
//   listAdmins,
// } from '../controllers/adminController.js';
// import { isAdmin } from '../middlewares/auth.js';
import { getUser, createUser } from '../controllers/userController.js';
import { AdminCreate, listAdmins } from '../controllers/adminController.js';

const routes = express.Router();

// admin create
routes.post('/create', AdminCreate);
routes.get('/', listAdmins);

// create user
routes.post('/:adminId/create', createUser);
routes.get('/:adminId', getUser);

export default routes;
