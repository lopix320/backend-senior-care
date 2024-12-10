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
import Servico from "./Servico";
import Paciente from "./Paciente";

@Entity({ schema: "SENIOR_CARE", name: "paciente_servico" })
export default class PacienteServico {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id_paciente_servico?: number;

  @ManyToOne(() => Servico, (servico) => servico.pacienteServico)
  @JoinColumn({ name: "id_servico", referencedColumnName: "id_servico" })
  servico?: Servico;

  @ManyToOne(() => Paciente, (paciente) => paciente.pacienteServico)
  @JoinColumn({ name: "id_paciente", referencedColumnName: "id_paciente" })
  paciente?: Paciente;

  // constructor(data: any) {
  //   this.bio = data?.bio;
  //   this.verificado = data?.verificado;
  //   this.curriculo = data?.curriculo;
  //   this.video_apresentacao = data?.video_apresentacao ?? false; // valor padrão se não for fornecido
  // }
}
