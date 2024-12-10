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
import Cuidador from "./Cuidador";
import Paciente from "./Paciente";

@Entity({ schema: "SENIOR_CARE", name: "usuario" })
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

  @Column({ type: "varchar", length: 100, nullable: false })
  senha: string;
  @Column({ type: "date", nullable: false })
  data_nascimento: string;

  @ManyToOne(() => Endereco, (endereco) => endereco.usuario)
  @JoinColumn({ name: "id_endereco", referencedColumnName: "id_endereco" })
  endereco?: Endereco;

  @OneToMany(() => Cuidador, (cuidador) => cuidador.usuario)
  cuidador?: Cuidador[];

  @OneToMany(() => Paciente, (paciente) => paciente.usuario)
  paciente?: Paciente[];

  constructor(data: any) {
    this.nome = data?.nome;
    this.email = data?.email;
    this.cpf = data?.cpf;
    this.aceitou_termos = data?.aceitou_termos ?? false; // valor padrão se não for fornecido
    this.numero_telefone = data?.numero_telefone;
    this.senha = data?.senha;
    this.data_nascimento = data?.data_nascimento;
  }
}
