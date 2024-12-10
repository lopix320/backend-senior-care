import { DataSource } from "typeorm";
import dotenv from "dotenv";
import Usuario from "./entities/Usuario";
import Endereco from "./entities/Endereco";
import Cuidador from "./entities/Cuidador";
import Paciente from "./entities/Paciente";
import PacienteServico from "./entities/PacienteServico";
import Servico from "./entities/Servico";
import { Contratacao } from "./entities/Contratacao";
const { Pool } = require("pg");

// import State "./entities/State";

dotenv.config();

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER || "test",
  password: process.env.DB_PSW || "test",
  database: process.env.DB_NAME || "test",
  entities: [
    Usuario,
    Endereco,
    Cuidador,
    Paciente,
    Servico,
    PacienteServico,
    Contratacao,
    // State
  ],
  ssl: {
    rejectUnauthorized: false,
  },
  extra: {
    trustServerCertificate: true,
  },
});

export default AppDataSource;
