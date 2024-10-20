import express from "express";
import usuarioRoutes from "./routes/UsuarioRoutes";

const routes = (app: express.Application) => {
  app.use("/usuario", usuarioRoutes);
};

export default routes;
