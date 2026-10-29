import 'reflect-metadata';
import { describe, expect, it } from 'vitest';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CriarComprovanteDto } from './criar-comprovante.dto.js';

describe('CriarComprovanteDto', () => {
  it('deve aceitar um comprovante válido', async () => {
    const dto = plainToInstance(CriarComprovanteDto, {
      objetoId: 1,
      descricao: 'Objeto entregue ao proprietário',
      dataRegistro: '2026-10-27T13:00:00.000Z',
    });

    const erros = await validate(dto);

    expect(erros).toHaveLength(0);
    expect(dto.dataRegistro).toBeInstanceOf(Date);
  });

  it('deve rejeitar dados inválidos', async () => {
    const dto = plainToInstance(CriarComprovanteDto, {
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

  it('deve rejeitar campos desconhecidos', async () => {
    const dto = plainToInstance(CriarComprovanteDto, {
      objetoId: 1,
      descricao: 'Comprovante válido',
      dataRegistro: '2026-10-27T13:00:00.000Z',
      id: 99,
    });

    const erros = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    expect(erros.some((erro) => erro.property === 'id')).toBe(true);
  });
});