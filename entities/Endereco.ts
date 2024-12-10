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
import Usuario from "./Usuario";

@Entity({ schema: "SENIOR_CARE", name: "endereco" })
export default class Endereco {
  @PrimaryGeneratedColumn({ type: "int" })
  id_endereco?: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  rua: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  cidade: string;

  @Column({ type: "varchar", length: 15, nullable: true })
  estado: string;

  @Column({ type: "varchar", length: 45, nullable: true })
  cep: string;

  @OneToMany(() => Usuario, (usuario) => usuario.endereco)
  usuario?: Usuario[];

  constructor(data: any) {
    this.rua = data?.rua;
    this.cidade = data?.cidade;
    this.cep = data?.cep;
    this.estado = data?.estado ?? false; // valor padrão se não for fornecido
  }
}
