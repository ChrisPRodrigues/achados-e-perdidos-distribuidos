import {
  IsOptional,
  IsString,
  IsNotEmpty,
  Matches,
  MaxLength,
} from 'class-validator';

export class AtualizarCategoriaDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, {
    message: 'O nome não pode conter apenas espaços',
  })
  @MaxLength(100)
  nome?: string;

  @IsOptional()
  @IsString()
  @Matches(/\S/, {
    message: 'A descrição não pode conter apenas espaços',
  })
  @MaxLength(500)
  descricao?: string;
}