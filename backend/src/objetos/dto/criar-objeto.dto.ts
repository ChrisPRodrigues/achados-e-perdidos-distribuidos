
import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

export class CriarObjetoDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/)
  @MaxLength(150)
  nome: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/\S/)
  descricao: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000000)
  foto?: string;

  @IsInt()
  @Min(1)
  categoriaId: number;

  @IsInt()
  @Min(1)
  localId: number;

  @IsInt()
  @Min(1)
  usuarioId: number;

  @Type(() => Date)
  @IsDate()
  dataEncontrado: Date;
}
