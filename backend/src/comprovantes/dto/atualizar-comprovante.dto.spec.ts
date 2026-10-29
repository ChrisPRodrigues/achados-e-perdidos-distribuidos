import 'reflect-metadata';

import { describe, expect, it } from 'vitest';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { AtualizarComprovanteDto } from './atualizar-comprovante.dto.js';

describe('AtualizarComprovanteDto', () => {
  it('deve aceitar uma atualização parcial', async () => {
    const dto = plainToInstance(AtualizarComprovanteDto, {
      descricao: 'Comprovante atualizado',
    });

    const erros = await validate(dto);

    expect(erros).toHaveLength(0);
  });

  it('deve rejeitar dados inválidos', async () => {
    const dto = plainToInstance(AtualizarComprovanteDto, {
      objetoId: -1,
      descricao: '',
      dataRegistro: 'data-invalida',
    });

    const erros = await validate(dto);

    expect(erros.map((erro) => erro.property)).toEqual(
      expect.arrayContaining([
        'objetoId',
        'descricao',
        'dataRegistro',
      ]),
    );
  });

  it('deve rejeitar a alteração do ID', async () => {
    const dto = plainToInstance(AtualizarComprovanteDto, {
      id: 99,
      descricao: 'Atualização válida',
    });

    const erros = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    expect(erros.some((erro) => erro.property === 'id')).toBe(true);
  });
});