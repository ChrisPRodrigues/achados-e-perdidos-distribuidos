export class SolicitacaoRespostaDto {
  id: number;
  usuarioId: number;
  objetoId: number;
  comprovacao: string | null;
  status: 'pendente' | 'aprovada' | 'recusada';
  createdAt: Date;
}