import { DataSource } from "typeorm";
import dotenv from "dotenv";
import Usuario from "./entities/Usuario";

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

    // State
  ],
  extra: {
    trustServerCertificate: true,
  },
});

export default AppDataSource;
