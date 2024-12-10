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
import { Contratacao } from "./Contratacao";

@Entity({ schema: "SENIOR_CARE", name: "cuidador" })
export default class Cuidador {
  @PrimaryGeneratedColumn({ type: "bigint" })
  id_cuidador?: number;

  @Column({ type: "text", nullable: true })
  bio: string;

  @Column({ type: "bool", nullable: true })
  verificado: boolean;

  @Column({ type: "varchar", length: 255, nullable: true })
  curriculo: string;

  @Column({ type: "varchar", length: 255, default: "C", nullable: false })
  nivel_conta: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  video_apresentacao: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.cuidador)
  @JoinColumn({ name: "id_usuario", referencedColumnName: "id_usuario" })
  usuario?: Usuario;

  @OneToMany(() => Contratacao, (contratacao) => contratacao.cuidador)
  contratacoes: Contratacao[];

  constructor(data: any) {
    this.bio = data?.bio;
    this.verificado = data?.verificado;
    this.curriculo = data?.curriculo;
    this.video_apresentacao = data?.video_apresentacao ?? false; // valor padrão se não for fornecido
  }
}
