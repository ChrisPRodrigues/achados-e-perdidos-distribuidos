
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CategoriaEntity } from '../../categorias/entities/categoria.entity.js';
import { LocalEntity } from '../../locais/entities/local.entity.js';
import { UsuarioEntity } from '../../usuarios/entities/usuario.entity.js';

@Entity('objetos')
export class ObjetoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  nome: string;

  @Column({ type: 'text' })
  descricao: string;

  @Column({ type: 'text', nullable: true })
  foto: string | null;

  @ManyToOne(() => CategoriaEntity, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'categoria_id' })
  categoria: CategoriaEntity;

  @ManyToOne(() => LocalEntity, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'local_id' })
  localEncontrado: LocalEntity;

  @ManyToOne(() => UsuarioEntity, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'usuario_id' })
  usuario: UsuarioEntity;

  @Column({ type: 'timestamp' })
  dataEncontrado: Date;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'encontrado',
  })
  status: 'encontrado' | 'devolvido';
}
