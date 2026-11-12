
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CriarSolicitacaoDto {
  @IsInt()
  @Min(1)
  usuarioId: number;

  @IsInt()
  @Min(1)
  objetoId: number;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  comprovacao?: string;

  @IsIn(['pendente', 'aprovada', 'recusada'])
  status: 'pendente' | 'aprovada' | 'recusada';
}
