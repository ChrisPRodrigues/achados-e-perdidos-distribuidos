import { IsIn, IsInt, IsOptional, Min } from 'class-validator';

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
  @IsIn(['pendente', 'aprovada', 'recusada'])
  status?: 'pendente' | 'aprovada' | 'recusada';
}