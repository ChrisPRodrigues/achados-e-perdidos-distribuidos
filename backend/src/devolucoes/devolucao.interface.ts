export interface Devolucao {
    id: number;
    objetoId: number;
    usuarioId: number;
    dataDevolucao: Date;
    observacao?: string;
}