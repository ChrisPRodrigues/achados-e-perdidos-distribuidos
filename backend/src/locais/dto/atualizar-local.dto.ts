
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class AtualizarLocalDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, {
    message: 'O nome não pode conter apenas espaços',
  })
  @MaxLength(150)
  nome?: string;

  @IsOptional()
  @IsString()
  @Matches(/\S/, {
    message: 'A descrição não pode conter apenas espaços',
  })
  @MaxLength(500)
  descricao?: string;
}