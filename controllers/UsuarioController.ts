import { Request, Response } from "express";
import Usuario from "../entities/Usuario";
import AppDataSource from "../data-source";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Not } from "typeorm";
import { cp } from "fs";

export default class UsuarioController {
  static async auth(req: Request, res: Response) {
    const { cpf } = req.body;

    try {
      const user = await AppDataSource.getRepository(Usuario)
        .createQueryBuilder("usuario")
        .where("usuario.cpf = :cpf", { cpf: cpf })
        .getOne();

      if (!user) {
        return res
          .status(401)
          .send({ error: "Usuário não encontrado ou senha incorreta" });
      }

      const token = jwt.sign({ user: user }, process.env.JWT_SECRET!, {
        expiresIn: "30d",
      });

      res.status(200).send({ user: user, token: token });
    } catch (error: any) {
      res
        .status(500)
        .send({ error: "Erro interno ao realizar login", msg: error.message });
    }
  }

  static async getByCpf(req: Request, res: Response) {
    const { cpf } = req.body;

    try {
      const user = await AppDataSource.getRepository(Usuario)
        .createQueryBuilder("usuario")
        .where("usuario.cpf = :cpf", { cpf: cpf })
        .getOne();

      if (!user) {
        return res
          .status(401)
          .send({ error: "Usuário não encontrado ou senha incorreta" });
      }

      res.status(200).send({ user: user });
    } catch (error: any) {
      res.status(500).send({ error: "Erro interno", msg: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const body = req.body;

      const userRepository = AppDataSource.getRepository(Usuario);

      const result = await userRepository.update(
        { id_usuario: body.id },
        { ...body }
      );

      return res.status(200).send(result);
    } catch (error: any) {
      res.status(500).send({ error: "Erro:", msg: error.message });
    }
  }

  static async register(req: Request, res: Response) {
    try {
      let userResult;

      const body = req.body;

      const { emailInUse, cpfExists } =
        await UsuarioController.credentialsExistence(body.email, body.cpf);

      if (emailInUse) {
        return res.status(405).send({ error: "Erro:", type: "email" });
      }

      // const userCommunityRepository = AppDataSource.getRepository(UserCommunity);

      userResult = await insertUser(body);

      // userCommunityRepository.save({ id_usuario: userResult.ID_USUARIO }); // verificar de onde tirar o id da community

      return res.status(200).send({ userResult });
    } catch (error: any) {
      res.status(500).send({ error: "Erro:", msg: error.message });
    }
  }

  static async credentialsExistence(
    email: string,
    cpf: string
  ): Promise<{ emailInUse: boolean; cpfExists: boolean }> {
    try {
      const usuarioRepository = AppDataSource.getRepository(Usuario);

      const emailInUse =
        (await usuarioRepository.findOne({
          where: { email: email, cpf: Not(cpf) },
        })) !== null;

      const cpfExists =
        (await usuarioRepository.findOne({ where: { cpf: cpf } })) !== null;

      return { emailInUse, cpfExists };
    } catch (error: unknown) {
      throw new Error((error as Error).message);
    }
  }
}

async function insertUser(data: any) {
  try {
    const usuarioRepository = AppDataSource.getRepository(Usuario);

    data.hash = bcrypt.hashSync(data.Senha, 10);

    const usuario = new Usuario(data);

    const result = await usuarioRepository.save(usuario);

    return result;
  } catch (error: unknown) {
    throw new Error((error as Error).message);
  }
}
