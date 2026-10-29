
import {
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

export class RegistrarDevolucaoDto {
  @IsInt()
  @Min(1)
  usuarioId: number;

  @IsOptional()
  @IsString()
  @Matches(/\S/, {
    message: 'A observação não pode conter apenas espaços',
  })
  @MaxLength(500)
  observacao?: string;
}