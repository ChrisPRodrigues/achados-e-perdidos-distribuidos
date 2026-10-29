import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ObjetoEntity } from '../../objetos/entities/objeto.entity.js';
import { UsuarioEntity } from '../../usuarios/entities/usuario.entity.js';

@Entity('devolucoes')
export class DevolucaoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // Preserva o objeto enquanto houver uma devolução associada.
  @OneToOne(() => ObjetoEntity, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'objeto_id' })
  objeto: ObjetoEntity;

  // Impede excluir o usuário enquanto houver devoluções associadas.
  @ManyToOne(() => UsuarioEntity, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'usuario_id' })
  usuario: UsuarioEntity;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  observacao: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  dataDevolucao: Date;
}