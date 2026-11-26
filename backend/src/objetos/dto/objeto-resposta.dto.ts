
export class ObjetoRespostaDto {
  id: number;
  nome: string;
  descricao: string;
  foto: string | null;
  categoriaId: number;
  localId: number;
  usuarioId: number;
  dataEncontrado: Date;
  status: 'encontrado' | 'devolvido';
}
