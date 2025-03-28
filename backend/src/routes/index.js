import { Router } from 'express';
import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import {
  ValidateToken,
  GeneralLimiter,
  trackLoginAttempts
} from '../middleware/index.js';
import { loginLimiter } from '../middleware/loginAttempts.js';
import controllerUser from '../controllers/controller.user.js';

dotenv.config({ path: './src/.env' });

const routes = Router();

routes.use(cors());
routes.use(express.json());
routes.use(GeneralLimiter);

// Rotas públicas
routes.post("/login", loginLimiter, trackLoginAttempts, controllerUser.login);
routes.post("/user/add", ValidateToken, controllerUser.addUser);
routes.get("/users", ValidateToken, controllerUser.listUsers);
routes.put("/users/edit/:id", ValidateToken, controllerUser.editUserById);
routes.get("/users/edit/:id", ValidateToken, controllerUser.getUserById);

export default routes;