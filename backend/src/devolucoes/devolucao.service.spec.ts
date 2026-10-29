
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import { DevolucaoService } from './devolucao.service.js';
import { DevolucaoEntity } from './entities/devolucao.entity.js';
import { ObjetoEntity } from '../objetos/entities/objeto.entity.js';
import { UsuarioEntity } from '../usuarios/entities/usuario.entity.js';

describe('DevolucaoService', () => {
  let service: DevolucaoService;

  // Simula a consulta com bloqueio do objeto
  const queryObjeto = {
    setLock: vi.fn(),
    where: vi.fn(),
    getOne: vi.fn(),
  };

  const repoObjeto = {
    createQueryBuilder: vi.fn(),
  };

  const repoUsuario = {
    findOneBy: vi.fn(),
  };

  const repoDevolucao = {
    findOne: vi.fn(),
  };

  // Simula o EntityManager do TypeORM
  const manager = {
    getRepository: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
  };

  const devolucoes = {
    manager: {
      transaction: vi.fn(),
    },
    findOne: vi.fn(),
  };

  beforeEach(() => {
    vi.resetAllMocks();

    queryObjeto.setLock.mockReturnValue(queryObjeto);
    queryObjeto.where.mockReturnValue(queryObjeto);

    queryObjeto.getOne.mockResolvedValue({
      id: 1,
      status: 'encontrado',
    });

    repoObjeto.createQueryBuilder.mockReturnValue(queryObjeto);

    repoUsuario.findOneBy.mockResolvedValue({
      id: 2,
      tipo: 'docente',
    });

    repoDevolucao.findOne.mockResolvedValue(null);

    manager.getRepository.mockImplementation((entity) => {
      if (entity === ObjetoEntity) return repoObjeto;
      if (entity === UsuarioEntity) return repoUsuario;
      if (entity === DevolucaoEntity) return repoDevolucao;
      throw new Error('Entidade inesperada');
    });

    manager.create.mockImplementation((_entity, dados) => ({
      ...dados,
    }));

    manager.save.mockImplementation(async (entity, dados) => {
      if (entity === DevolucaoEntity) {
        return { ...dados, id: 5 };
      }

      return dados;
    });

    devolucoes.manager.transaction.mockImplementation(
      async (callback) => callback(manager),
    );

    devolucoes.findOne.mockResolvedValue({
      id: 5,
      objeto: { id: 1 },
      usuario: { id: 2 },
      dataDevolucao: new Date('2026-10-25T12:00:00Z'),
      observacao: null,
    });

    service = new DevolucaoService(
      devolucoes as any,
      {} as any,
      {} as any,
    );
  });

  it('deve lançar erro quando o objeto não existir', async () => {
    queryObjeto.getOne.mockResolvedValue(null);

    await expect(
      service.adicionar({ objetoId: 99, usuarioId: 2 }),
    ).rejects.toThrow(NotFoundException);

    expect(manager.save).not.toHaveBeenCalled();
  });

  it('deve lançar erro quando o usuário não existir', async () => {
    repoUsuario.findOneBy.mockResolvedValue(null);

    await expect(
      service.adicionar({ objetoId: 1, usuarioId: 99 }),
    ).rejects.toThrow(NotFoundException);

    expect(manager.save).not.toHaveBeenCalled();
  });

  it('deve impedir uma segunda devolução do mesmo objeto', async () => {
    repoDevolucao.findOne.mockResolvedValue({ id: 10 });

    await expect(
      service.adicionar({ objetoId: 1, usuarioId: 2 }),
    ).rejects.toThrow(ConflictException);

    expect(manager.save).not.toHaveBeenCalled();
  });

  it('deve impedir devolução registrada por aluno', async () => {
    repoUsuario.findOneBy.mockResolvedValue({
      id: 2,
      tipo: 'aluno',
    });

    await expect(
      service.adicionar({ objetoId: 1, usuarioId: 2 }),
    ).rejects.toThrow(BadRequestException);

    expect(manager.save).not.toHaveBeenCalled();
  });

  it('deve registrar a devolução e atualizar o objeto', async () => {
    const resultado = await service.adicionar({
      objetoId: 1,
      usuarioId: 2,
      observacao: 'Objeto entregue ao proprietário',
    });

    expect(
      devolucoes.manager.transaction,
    ).toHaveBeenCalledOnce();

    expect(queryObjeto.setLock).toHaveBeenCalledWith(
      'pessimistic_write',
    );

    expect(manager.save).toHaveBeenCalledWith(
      ObjetoEntity,
      expect.objectContaining({
        status: 'devolvido',
      }),
    );

    expect(manager.create).toHaveBeenCalledWith(
      DevolucaoEntity,
      expect.objectContaining({
        observacao: 'Objeto entregue ao proprietário',
      }),
    );

    expect(manager.save).toHaveBeenCalledWith(
      DevolucaoEntity,
      expect.any(Object),
    );

    expect(resultado).toMatchObject({
      id: 5,
      objetoId: 1,
      usuarioId: 2,
    });
  });
});