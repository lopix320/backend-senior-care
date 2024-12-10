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
import PacienteServico from "../entities/PacienteServico";
import { Contratacao } from "../entities/Contratacao";

export default class UsuarioController {
  static async auth(req: Request, res: Response) {
    const { email, senha } = req.body;

    try {
      // const user = await AppDataSource.getRepository(Usuario).findOneBy({
      //   email: email,
      //   senha: senha,
      // });
      const user = await AppDataSource.getRepository(Usuario).find({
        where: { email: email, senha: senha },
        relations: { paciente: true, cuidador: true, endereco: true },
      });

      if (!user) {
        return res
          .status(401)
          .send({ error: "Usuário não encontrado ou senha incorreta" });
      }

      // const token = jwt.sign({ user: user }, process.env.JWT_SECRET!, {
      //   expiresIn: "30d",
      // });

      res.status(200).send({ user: user });
    } catch (error: any) {
      res
        .status(500)
        .send({ error: "Erro interno ao realizar login", msg: error.message });
    }
  }
  static async getAll(req: Request, res: Response) {
    try {
      const usuarios = await AppDataSource.getRepository(Usuario).find({
        relations: {
          paciente: true,
          cuidador: { contratacoes: true },
          endereco: true,
        },
        order: {
          cuidador: { nivel_conta: "ASC", contratacoes: { nota: "DESC" } },
        },
      });

      res.status(200).send({ usuarios: usuarios });
    } catch (error: any) {
      res
        .status(500)
        .send({ error: "Erro interno ao realizar login", msg: error.message });
    }
  }
  static async getPacientesCuidador(req: Request, res: Response) {
    const { id_cuidador } = req.body;

    try {
      // Usando QueryBuilder para criar uma consulta com joins e filtros mais complexos
      const usuarios = await AppDataSource.getRepository(Usuario)
        .createQueryBuilder("usuario")
        .leftJoinAndSelect("usuario.paciente", "paciente")
        .leftJoinAndSelect("paciente.contratacoes", "contratacao")
        .leftJoinAndSelect("usuario.endereco", "endereco")
        .leftJoinAndSelect("paciente.pacienteServico", "pacienteServico")
        .leftJoinAndSelect("pacienteServico.servico", "servico")
        .where("contratacao.cuidador = :id_cuidador", { id_cuidador })
        .getMany();

      res.status(200).send({ usuarios });
    } catch (error: any) {
      res
        .status(500)
        .send({ error: "Erro interno ao buscar dados", msg: error.message });
    }
  }
  static async getCuidadores(req: Request, res: Response) {
    const { id_paciente } = req.body;

    try {
      // Usando QueryBuilder para criar uma consulta com joins e filtros mais complexos
      const usuarios = await AppDataSource.getRepository(Contratacao).find({
        where: { paciente: id_paciente },
        relations: { cuidador: { usuario: true } },
      });

      res.status(200).send({ usuarios });
    } catch (error: any) {
      res
        .status(500)
        .send({ error: "Erro interno ao buscar dados", msg: error.message });
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

  static async setContratacao(req: Request, res: Response) {
    const { id_paciente, id_cuidador } = req.body;

    try {
      const contratacao = await AppDataSource.getRepository(Contratacao).save({
        cuidador: id_cuidador,
        paciente: id_paciente,
        data_inicio: new Date(),
      });

      // if (!contratacao) {
      //   return res.status(401).send({ error: "Algo deu errado", ok: false });
      // }

      res.status(200).send({ ok: true });
    } catch (error: any) {
      res
        .status(500)
        .send({ error: "Erro interno", msg: error.message, ok: false });
    }
  }
  static async setAvaliacao(req: Request, res: Response) {
    const { id_paciente, id_cuidador, stars, comment } = req.body;

    try {
      const contratacao = await AppDataSource.getRepository(Contratacao).update(
        {
          paciente: id_paciente,
          cuidador: id_cuidador,
        },
        {
          nota: stars,
          texto_avaliacao: comment,
        }
      );

      // if (!contratacao) {
      //   return res.status(401).send({ error: "Algo deu errado", ok: false });
      // }

      res.status(200).send({ ok: true });
    } catch (error: any) {
      res
        .status(500)
        .send({ error: "Erro interno", msg: error.message, ok: false });
    }
  }
  static async acceptContratacao(req: Request, res: Response) {
    const { id_paciente, id_cuidador } = req.body;

    try {
      const contratacao = await AppDataSource.getRepository(Contratacao).update(
        {
          cuidador: id_cuidador,
          paciente: id_paciente,
        },
        { confirmacao: true }
      );

      // if (!contratacao) {
      //   return res.status(401).send({ error: "Algo deu errado", ok: false });
      // }

      res.status(200).send({ ok: true });
    } catch (error: any) {
      res
        .status(500)
        .send({ error: "Erro interno", msg: error.message, ok: false });
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
      const body = req.body;
      console.log(body.firtFormData.cep);
      // const { emailInUse, cpfExists } =
      //   await UsuarioController.credentialsExistence(body.email, body.cpf);

      // if (emailInUse) {
      //   return res.status(405).send({ error: "Erro:", type: "email" });
      // }
      const enderecoRepository = AppDataSource.getRepository(Endereco);

      const resultEndereco = await enderecoRepository.save({
        cep: body.firtFormData.cep,
        cidade: body.firtFormData.cidade,
        estado: body.firtFormData.estado,
        rua: body.firtFormData.rua,
      });

      const usuarioRepository = AppDataSource.getRepository(Usuario);

      const userResult = await usuarioRepository.save({
        endereco: resultEndereco,
        cpf: body.firtFormData.cpf,
        email: body.firtFormData.email,
        aceitou_termos: body.firtFormData.aceitarTermos,
        nome: body.firtFormData.nome,
        senha: body.firtFormData.senha,
        numero_telefone: body.firtFormData.telefone,
        // data_nascimento: body.firtFormData.data_nascimento,
      });
      const pacienteRepository = AppDataSource.getRepository(Paciente);

      const pacienteResult = await pacienteRepository.save({
        usuario: userResult,
        acessibilidade: body.secondFormData.acessibilidade,
        acomp_24: body.secondFormData.acompanhamento,
        mobilidade_reduzida: body.secondFormData.mobilidade,
      });

      const pacSerRepository = AppDataSource.getRepository(PacienteServico);
      body.secondFormData.servico.map(async (servico: any) => {
        await pacSerRepository.save({
          paciente: pacienteResult,
          servico: servico,
        });
      });

      // userResult = await insertUser(body);

      return res.status(200).send({ ...resultEndereco, ...userResult });
    } catch (error: any) {
      res.status(500).send({ error: "Erro:", msg: error.message });
    }
  }
  static async registerCuidador(req: Request, res: Response) {
    try {
      const body = req.body;
      console.log(body.firtFormData.cep);
      // const { emailInUse, cpfExists } =
      //   await UsuarioController.credentialsExistence(body.email, body.cpf);

      // if (emailInUse) {
      //   return res.status(405).send({ error: "Erro:", type: "email" });
      // }
      const enderecoRepository = AppDataSource.getRepository(Endereco);

      const resultEndereco = await enderecoRepository.save({
        cep: body.firtFormData.cep,
        cidade: body.firtFormData.cidade,
        estado: body.firtFormData.estado,
        rua: body.firtFormData.rua,
      });

      const usuarioRepository = AppDataSource.getRepository(Usuario);

      const userResult = await usuarioRepository.save({
        endereco: resultEndereco,
        cpf: body.firtFormData.cpf,
        email: body.firtFormData.email,
        aceitou_termos: body.firtFormData.aceitarTermos,
        nome: body.firtFormData.nome,
        senha: body.firtFormData.senha,
        numero_telefone: body.firtFormData.telefone,
        // data_nascimento: body.firtFormData.data_nascimento,
      });
      const cuidadorRepository = AppDataSource.getRepository(Cuidador);

      const pacienteResult = await cuidadorRepository.save({
        usuario: userResult,
        bio:
          body.secondFormData.especialidade + "/" + body.secondFormData.tempo,
        curriculo: body.secondFormData.curriculo,
        verificado: true,
        nivel_conta: "C",
      });

      // userResult = await insertUser(body);

      return res.status(200).send({ ...resultEndereco, ...userResult });
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

async function insertPaciente(data: any) {
  try {
    const usuarioRepository = AppDataSource.getRepository(Paciente);

    // data.hash = bcrypt.hashSync(data.Senha, 10);

    const paciente = new Paciente(data);

    const result = await usuarioRepository.save(paciente);

    return result;
  } catch (error: unknown) {
    throw new Error((error as Error).message);
  }
}
async function insertCuidador(data: any) {
  try {
    const usuarioRepository = AppDataSource.getRepository(Cuidador);

    // data.hash = bcrypt.hashSync(data.Senha, 10);

    const cuidador = new Cuidador(data);

    const result = await usuarioRepository.save(cuidador);

    return result;
  } catch (error: unknown) {
    throw new Error((error as Error).message);
  }
}
