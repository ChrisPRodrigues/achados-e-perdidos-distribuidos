
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CriarUsuarioDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, {
    message: 'O nome não pode conter apenas espaços',
  })
  @MaxLength(150)
  nome: string;

  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsIn(['aluno', 'docente'])
  tipo: 'aluno' | 'docente';
}