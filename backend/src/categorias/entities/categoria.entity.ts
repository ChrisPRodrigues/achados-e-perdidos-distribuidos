import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('categorias')
export class CategoriaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
  })
  nome: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  descricao: string | null;
}