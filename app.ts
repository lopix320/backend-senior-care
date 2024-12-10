import "reflect-metadata";
import AppDataSource from "./data-source";
import routes from "./api";
import express from "express";
import cors from "cors";

const app = express();
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());
routes(app);

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Erro ao acessar banco:", err);
  });

app.listen(4445);
