
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UsuarioEntity } from '../../usuarios/entities/usuario.entity.js';
import { ObjetoEntity } from '../../objetos/entities/objeto.entity.js';

@Entity('solicitacoes')
export class SolicitacaoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UsuarioEntity, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'usuario_id' })
  usuario: UsuarioEntity;

  @ManyToOne(() => ObjetoEntity, {
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'objeto_id' })
  objeto: ObjetoEntity;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'pendente',
  })
  status: 'pendente' | 'aprovada' | 'recusada';
}
