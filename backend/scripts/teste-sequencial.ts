import { ProcessamentoParaleloService } from '../src/processamento-paralelo/processamento-paralelo.service.ts';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  const service = new ProcessamentoParaleloService();

  const imagens = [
    join(__dirname, '../imagens-teste/objeto1.jpg'),
    join(__dirname, '../imagens-teste/objeto2.jpg'),
    join(__dirname, '../imagens-teste/objeto3.jpg'),
  ];

  console.log('Iniciando processamento sequencial...');

  const resultado = await service.processarSequencial(imagens);

  console.log(resultado);
}

main().catch((erro) => {
  console.error('Erro no processamento:', erro);
  process.exitCode = 1;
});