export class SolicitacaoRespostaDto {
    id: number;
    usuarioId: number;
    objetoId: number;
    status: 'pendente' | 'aprovada' | 'recusada';
}
