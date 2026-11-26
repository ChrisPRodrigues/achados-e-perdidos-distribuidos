import 'dotenv/config';
import { hash } from 'bcryptjs';

import dataSource from '../data-source.js';
import { UsuarioEntity } from '../usuarios/entities/usuario.entity.js';

async function criarAdministrador(): Promise<void> {
  const nome = process.env.ADMIN_NOME?.trim();
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const senha = process.env.ADMIN_SENHA;

  if (!nome || !email || !senha || senha.length < 8) {
    throw new Error(
      'Configure ADMIN_NOME, ADMIN_EMAIL e ADMIN_SENHA. A senha deve ter pelo menos 8 caracteres.',
    );
  }

  try {
    await dataSource.initialize();

    const usuariosRepository = dataSource.getRepository(UsuarioEntity);

    const usuarioExistente = await usuariosRepository.findOneBy({
      email,
    });

    if (usuarioExistente) {
      throw new Error(
        'Já existe um usuário com esse e-mail. Nenhuma alteração foi realizada.',
      );
    }

    const administradorExistente = await usuariosRepository.findOneBy({
      tipo: 'admin',
    });

    if (administradorExistente) {
      throw new Error(
        'Já existe um administrador cadastrado. Nenhuma alteração foi realizada.',
      );
    }

    const senhaHash = await hash(senha, 12);

    const administrador = usuariosRepository.create({
      nome,
      email,
      tipo: 'admin',
      senha_hash: senhaHash,
      status: 'ativo',
    });

    await usuariosRepository.save(administrador);

    console.log('Administrador criado com sucesso!');
    console.log(`E-mail: ${email}`);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

criarAdministrador().catch((erro: unknown) => {
  console.error(
    'Erro ao criar administrador:',
    erro instanceof Error ? erro.message : erro,
  );

  process.exitCode = 1;
});