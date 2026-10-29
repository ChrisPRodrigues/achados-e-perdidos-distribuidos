
import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class AtualizarDevolucaoDto {
  @IsOptional()
  @IsString()
  @Matches(/\S/, {
    message: 'A observação não pode conter apenas espaços',
  })
  @MaxLength(500)
  observacao?: string;
}