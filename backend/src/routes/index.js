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
import controllerExtra from '../controllers/controller.extra.js'

dotenv.config({ path: './src/.env' });

const routes = Router();

routes.use(cors());
routes.use(express.json());
routes.use(GeneralLimiter);

// Rotas públicas
routes.post("/login", loginLimiter, trackLoginAttempts, controllerUser.login);
routes.post("/users/add", ValidateToken, controllerUser.addUser);
routes.get("/users", ValidateToken, controllerUser.listUsers);
routes.put("/users/edit/:id", ValidateToken, controllerUser.editUserById);
routes.get("/users/edit/:id", ValidateToken, controllerUser.getUserById);

// Rota para atualização de status
routes.put("/users/:id/status", ValidateToken, controllerUser.editUserStatus);

// Rota para carregar extrajudiciais
routes.get("/extras", ValidateToken, controllerExtra.listExtra);
routes.post("/extra/add", ValidateToken, controllerExtra.addExtras);
// Rota para atribuir responsável a um documento
// Usando rota sem parâmetros no path para evitar problemas com caracteres especiais
routes.put("/extras/assign", ValidateToken, controllerExtra.assignInternalDelivery);

export default routes;