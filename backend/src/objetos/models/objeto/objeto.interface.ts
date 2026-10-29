export interface Objeto {
  id: number;
  nome: string;
  descricao: string;
  categoriaId: number;
  localEncontrado: string;
  dataEncontrado: Date;
  status: 'encontrado' | 'devolvido';
}
