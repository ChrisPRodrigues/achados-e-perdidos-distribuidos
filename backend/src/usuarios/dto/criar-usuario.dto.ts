import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
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

  @IsString()
  @IsNotEmpty()
  @MinLength(8, {
    message: 'A senha deve ter pelo menos 8 caracteres',
  })
  @MaxLength(100)
  senha: string;
}