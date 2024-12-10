import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import Endereco from "./Endereco";
import Usuario from "./Usuario";
import PacienteServico from "./PacienteServico";

@Entity({ schema: "SENIOR_CARE", name: "servico" })
export default class Servico {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id_servico?: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  descricao: boolean;

  @OneToMany(
    () => PacienteServico,
    (pacienteServico) => pacienteServico.servico
  )
  pacienteServico?: PacienteServico[];

  constructor(data: any) {
    this.descricao = data?.descricao;
  }
}
