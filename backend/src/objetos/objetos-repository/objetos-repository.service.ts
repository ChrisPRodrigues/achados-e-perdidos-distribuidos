import { Injectable } from '@nestjs/common';
import type { Objeto } from '../models/objeto/objeto.interface.js';

@Injectable()
export class ObjetosRepositoryService {
  private objetos: Objeto[] = [];

  private proximoId = 1;

  listar(): Objeto[] {
    return this.objetos;
  }

  buscarPorId(id: number): Objeto | undefined {
    return this.objetos.find((objeto) => objeto.id === id);
  }

  adicionar(objeto: Omit<Objeto, 'id'>): Objeto {
    const novoObjeto: Objeto = {
      id: this.proximoId++,
      ...objeto,
    };

    this.objetos.push(novoObjeto);

    return novoObjeto;
  }

  atualizar(id: number, dados: Partial<Objeto>): Objeto | undefined {
    const objeto = this.buscarPorId(id);

    if (!objeto) {
      return undefined;
    }

    Object.assign(objeto, dados);

    return objeto;
  }
}
