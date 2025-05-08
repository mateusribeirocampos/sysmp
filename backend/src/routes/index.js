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
import controllerFisico from '../controllers/controller.fisico.js';
import controllerSuspenso from '../controllers/controller.suspenso.js';
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
routes.delete("/users/delete/:id", ValidateToken, controllerUser.deleteUser);
routes.put("/users/:id/status", ValidateToken, controllerUser.editUserStatus);

// Rota para carregar extrajudiciais
routes.get("/extras", ValidateToken, controllerExtra.listExtra);
routes.post("/extra/add", ValidateToken, controllerExtra.addExtras);
routes.put("/extra/assign", ValidateToken, controllerExtra.assignInternalDelivery);
routes.get("/extra/edit/:id_extra", ValidateToken, controllerExtra.getExtraById);
routes.put("/extra/edit/:id_extra", ValidateToken, controllerExtra.updateExtra);
routes.delete("/extra/delete/:id_extra", ValidateToken, controllerExtra.deleteExtra);

// Rota para carregar físicos
routes.get("/fisicos", ValidateToken, controllerFisico.listFisico);
routes.post("/fisico/add", ValidateToken, controllerFisico.addFisico);
routes.put("/fisico/assign", ValidateToken, controllerFisico.assignInternalDelivery);
routes.get("/fisico/edit/:id_fisico", ValidateToken, controllerFisico.getFisicoById);
routes.put("/fisico/edit/:id_fisico", ValidateToken, controllerFisico.updateFisico);
routes.delete("/fisico/delete/:id_fisico", ValidateToken, controllerFisico.deleteFisico);

// Rota para carregar suspensos
routes.get("/suspensos", ValidateToken, controllerSuspenso.listSuspenso);
routes.post("/suspenso/add", ValidateToken, controllerSuspenso.addSuspenso);
routes.put("/suspenso/assign", ValidateToken, controllerSuspenso.updateInternalDelivery);
routes.get("/suspenso/edit/:id_suspenso", ValidateToken, controllerSuspenso.getSuspensoById);
routes.put("/suspenso/edit/:id_suspenso", ValidateToken, controllerSuspenso.updateSuspenso);
routes.delete("/suspenso/delete/:id_suspenso", ValidateToken, controllerSuspenso.deleteSuspenso);

export default routes;