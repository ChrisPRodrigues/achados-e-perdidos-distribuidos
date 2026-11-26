
export class UsuarioRespostaDto {
  id: number;
  nome: string;
  email: string;
  tipo: 'aluno' | 'docente' | 'admin';
  status: 'ativo' | 'pendente' | 'rejeitado' | 'aguardando_senha';
}
