import { IsIn, IsInt, Min } from 'class-validator';

export class CriarSolicitacaoDto {
  @IsInt()
  @Min(1)
  usuarioId: number;

  @IsInt()
  @Min(1)
  objetoId: number;

  @IsIn(['pendente', 'aprovada', 'recusada'])
  status: 'pendente' | 'aprovada' | 'recusada';
}