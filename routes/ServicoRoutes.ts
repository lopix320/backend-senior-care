import express from "express";
import UsuarioController from "../controllers/UsuarioController";
import ServicoController from "../controllers/ServicoController";
const servicoRoutes = express.Router();

servicoRoutes.post("/getAll", ServicoController.getAll);

export default servicoRoutes;
