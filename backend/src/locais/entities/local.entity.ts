import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('locais')
export class LocalEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 150,
    unique: true,
  })
  nome: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  descricao: string | null;
}