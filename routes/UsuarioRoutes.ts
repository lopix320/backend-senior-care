import express from "express";
import UsuarioController from "../controllers/UsuarioController";
const usuarioRoutes = express.Router();

usuarioRoutes.post("/auth", UsuarioController.auth);
usuarioRoutes.post("/getByCpf", UsuarioController.getByCpf);
usuarioRoutes.post("/register", UsuarioController.register);
export default usuarioRoutes;
