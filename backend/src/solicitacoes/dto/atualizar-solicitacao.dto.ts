
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class AtualizarSolicitacaoDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  usuarioId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  objetoId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  comprovacao?: string | null;

  @IsOptional()
  @IsIn(['pendente', 'aprovada', 'recusada'])
  status?: 'pendente' | 'aprovada' | 'recusada';
}
