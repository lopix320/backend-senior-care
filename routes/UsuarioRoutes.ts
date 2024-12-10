import express from "express";
import UsuarioController from "../controllers/UsuarioController";
const usuarioRoutes = express.Router();

usuarioRoutes.post("/auth", UsuarioController.auth);
usuarioRoutes.post("/getByCpf", UsuarioController.getByCpf);
usuarioRoutes.post("/register", UsuarioController.register);
usuarioRoutes.post("/registerCuidador", UsuarioController.registerCuidador);
usuarioRoutes.get("/getAll", UsuarioController.getAll);
usuarioRoutes.post("/setContratacao", UsuarioController.setContratacao);
usuarioRoutes.post("/acceptContratacao", UsuarioController.acceptContratacao);
usuarioRoutes.post("/getCuidadores", UsuarioController.getCuidadores);
usuarioRoutes.post("/setAvaliacao", UsuarioController.setAvaliacao);
usuarioRoutes.post(
  "/getPacientesCuidador",
  UsuarioController.getPacientesCuidador
);
export default usuarioRoutes;
