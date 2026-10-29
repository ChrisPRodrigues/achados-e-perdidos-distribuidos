import 'reflect-metadata';

import { describe, expect, it } from 'vitest';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AtualizarSolicitacaoDto } from './atualizar-solicitacao.dto.js';

describe('AtualizarSolicitacaoDto', () => {
  it('deve aceitar uma atualização parcial', async () => {
    const dto = plainToInstance(AtualizarSolicitacaoDto, {
      status: 'aprovada',
    });

    const erros = await validate(dto);

    expect(erros).toHaveLength(0);
  });

  it('deve rejeitar dados inválidos', async () => {
    const dto = plainToInstance(AtualizarSolicitacaoDto, {
      usuarioId: -1,
      objetoId: 'abc',
      status: 'finalizada',
    });

    const erros = await validate(dto);

    expect(erros.map((erro) => erro.property)).toEqual(
      expect.arrayContaining([
        'usuarioId',
        'objetoId',
        'status',
      ]),
    );
  });

  it('deve rejeitar a alteração do ID', async () => {
    const dto = plainToInstance(AtualizarSolicitacaoDto, {
      id: 99,
      status: 'aprovada',
    });

    const erros = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    expect(erros.some((erro) => erro.property === 'id')).toBe(true);
  });
});