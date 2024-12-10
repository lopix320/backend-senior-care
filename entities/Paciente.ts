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
import { Contratacao } from "./Contratacao";

@Entity({ schema: "SENIOR_CARE", name: "paciente" })
export default class Paciente {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id_paciente?: number;

  @Column({ type: "bool", nullable: true })
  acomp_24: boolean;

  @Column({ type: "bool", nullable: true })
  mobilidade_reduzida: boolean;

  @Column({ type: "bool", nullable: true })
  acessibilidade: boolean;

  @ManyToOne(() => Usuario, (usuario) => usuario.cuidador)
  @JoinColumn({ name: "id_usuario", referencedColumnName: "id_usuario" })
  usuario?: Usuario;

  @OneToMany(
    () => PacienteServico,
    (pacienteServico) => pacienteServico.paciente
  )
  pacienteServico?: PacienteServico[];

  @OneToMany(() => Contratacao, (contratacao) => contratacao.paciente)
  contratacoes: Contratacao[];

  constructor(data: any) {
    this.acomp_24 = data?.acomp_24;
    this.mobilidade_reduzida = data?.mobilidade_reduzida;
    this.acessibilidade = data?.acessibilidade;
  }
}
