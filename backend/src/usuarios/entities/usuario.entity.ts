import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('usuarios')
export class UsuarioEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  nome: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20 })
  tipo: 'aluno' | 'docente' | 'admin';

  @Column({ type: 'varchar', length: 255, nullable: true })
  senha_hash: string | null;

  @Column({ type: 'varchar', length: 30, default: 'aguardando_senha' })
  status: 'ativo' | 'pendente' | 'rejeitado' | 'aguardando_senha';
}