import { Request, Response } from "express";
import Usuario from "../entities/Usuario";
import AppDataSource from "../data-source";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Not } from "typeorm";
import { cp } from "fs";
import Endereco from "../entities/Endereco";
import Paciente from "../entities/Paciente";
import Cuidador from "../entities/Cuidador";
import Servico from "../entities/Servico";

export default class ServicoController {
  static async getAll(req: Request, res: Response) {
    try {
      const servico = await AppDataSource.getRepository(Servico).find();

      res.status(200).send({ servico: servico });
    } catch (error: any) {
      res
        .status(500)
        .send({ error: "Erro interno ao realizar login", msg: error.message });
    }
  }
}
