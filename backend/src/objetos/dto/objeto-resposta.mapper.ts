import type { ObjetoEntity } from '../entities/objeto.entity.js';
import type { ObjetoRespostaDto } from './objeto-resposta.dto.js';

export function paraObjetoResposta(
  objeto: ObjetoEntity,
): ObjetoRespostaDto {
  return {
    id: objeto.id,
    nome: objeto.nome,
    descricao: objeto.descricao,
    categoriaId: objeto.categoria.id,
    localId: objeto.localEncontrado.id,
    usuarioId: objeto.usuario.id,
    dataEncontrado: objeto.dataEncontrado,
    status: objeto.status,
  };
}