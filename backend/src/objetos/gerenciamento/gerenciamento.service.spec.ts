
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import { GerenciamentoService } from './gerenciamento.service.js';

describe('GerenciamentoService', () => {
  let service: GerenciamentoService;

  const objetosRepository = {
    findOne: vi.fn(),
    save: vi.fn(),
  };

  const categoriasRepository = {
    findOneBy: vi.fn(),
  };

  const locaisRepository = {
    findOneBy: vi.fn(),
  };

  // Simula o serviço responsável pelas devoluções
  const devolucoesService = {
    adicionar: vi.fn(),
  };

  const objeto = {
    id: 1,
    nome: 'Objeto teste',
    descricao: 'Descrição',
    categoria: { id: 1 },
    localEncontrado: { id: 1 },
    usuario: { id: 2 },
    dataEncontrado: new Date(),
    status: 'devolvido',
  };

  beforeEach(() => {
    vi.resetAllMocks();

    objetosRepository.findOne.mockResolvedValue({ ...objeto });

    devolucoesService.adicionar.mockResolvedValue({
      id: 10,
      objetoId: 1,
      usuarioId: 2,
    });

    service = new GerenciamentoService(
      objetosRepository as any,
      categoriasRepository as any,
      locaisRepository as any,
      devolucoesService as any,
    );
  });

  it('deve repassar erro quando o objeto não existir', async () => {
    devolucoesService.adicionar.mockRejectedValue(
      new NotFoundException('Objeto não encontrado'),
    );

    await expect(
      service.devolver(99, 2),
    ).rejects.toThrow(NotFoundException);

    expect(objetosRepository.findOne).not.toHaveBeenCalled();
  });

  it('deve repassar erro de objeto já devolvido', async () => {
    devolucoesService.adicionar.mockRejectedValue(
      new ConflictException('Este objeto já foi devolvido'),
    );

    await expect(
      service.devolver(1, 2),
    ).rejects.toThrow(ConflictException);
  });

  it('deve repassar erro quando o usuário não existir', async () => {
    devolucoesService.adicionar.mockRejectedValue(
      new NotFoundException('Usuário não encontrado'),
    );

    await expect(
      service.devolver(1, 99),
    ).rejects.toThrow(NotFoundException);
  });

  it('deve repassar erro quando o usuário for aluno', async () => {
    devolucoesService.adicionar.mockRejectedValue(
      new BadRequestException(
        'Somente docentes podem registrar devoluções',
      ),
    );

    await expect(
      service.devolver(1, 2),
    ).rejects.toThrow(BadRequestException);
  });

  it('deve registrar a devolução e retornar o objeto atualizado', async () => {
    const resultado = await service.devolver(
      1,
      2,
      'Objeto entregue ao proprietário',
    );

    expect(devolucoesService.adicionar).toHaveBeenCalledWith({
      objetoId: 1,
      usuarioId: 2,
      observacao: 'Objeto entregue ao proprietário',
    });

    expect(objetosRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: {
        categoria: true,
        localEncontrado: true,
        usuario: true,
      },
    });

    expect(resultado).toMatchObject({
      id: 1,
      status: 'devolvido',
    });
  });
});