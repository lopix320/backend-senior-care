import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import Paciente from "./Paciente";
import Cuidador from "./Cuidador";
// Substitua pelo caminho correto

@Entity({ schema: "SENIOR_CARE", name: "contratacao" }) // Substitua pelo nome real da tabela no banco de dados
export class Contratacao {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id_contratacao: number;

  @Column({ type: "date" })
  data_inicio: Date;

  @Column({ type: "date" })
  data_fim: Date;

  @Column({ type: "int4", nullable: true })
  nota: number;

  @Column({ type: "text", nullable: true })
  texto_avaliacao: string;

  @Column({ type: "boolean" })
  confirmacao: boolean;

  // Relação com Paciente
  @ManyToOne(() => Paciente, (paciente) => paciente.contratacoes)
  @JoinColumn({ name: "id_paciente" })
  paciente: Paciente;

  // Relação com Cuidador
  @ManyToOne(() => Cuidador, (cuidador) => cuidador.contratacoes)
  @JoinColumn({ name: "id_cuidador" })
  cuidador: Cuidador;
}
