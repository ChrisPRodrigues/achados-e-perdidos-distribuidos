export interface Solicitacao {
  id: number;
  usuarioId: number;
  objetoId: number;
  status: 'pendente' | 'aprovada' | 'recusada';
}