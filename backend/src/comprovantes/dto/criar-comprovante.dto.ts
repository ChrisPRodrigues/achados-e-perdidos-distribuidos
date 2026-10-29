import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';

import { Type } from 'class-transformer';

export class CriarComprovanteDto {
  @IsInt()
  @Min(1)
  objetoId: number;

  @IsString()
  @IsNotEmpty()
  descricao: string;

  @Type(() => Date)
  @IsDate()
  dataRegistro: Date;
}