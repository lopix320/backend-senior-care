import express from "express";
import usuarioRoutes from "./routes/UsuarioRoutes";
import servicoRoutes from "./routes/ServicoRoutes";

const routes = (app: express.Application) => {
  app.use("/usuario", usuarioRoutes);
  app.use("/servico", servicoRoutes);
};

export default routes;
