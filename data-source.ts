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
  host: "seniorcaredb123.postgres.database.azure.com",
  port: parseInt("5432"),
  username: "gabriel320",
  password: "lopes0502@L",
  database: "postgres",
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
