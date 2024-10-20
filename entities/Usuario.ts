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

@Entity({ schema: "SENIOR_CARE", name: "usuarios" })
export default class Usuario {
  @PrimaryGeneratedColumn({ type: "int" })
  id_usuario?: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  nome: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  email: string;

  @Column({ type: "varchar", length: 15, nullable: true })
  cpf: string;

  @Column({ type: "boolean", default: false, nullable: true })
  aceitou_termos: boolean;

  @Column({ type: "varchar", length: 45, nullable: true })
  numero_telefone: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  tipo_usuario: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  senha: string;

  constructor(data: any) {
    this.id_usuario = data.id_usuario;
    this.nome = data.nome;
    this.email = data.email;
    this.cpf = data.cpf;
    this.tipo_usuario = data.tipo_usuario;
    this.aceitou_termos = data.aceitou_termos ?? false; // valor padrão se não for fornecido
    this.numero_telefone = data.numero_telefone;
    this.senha = data.senha;
  }
}
