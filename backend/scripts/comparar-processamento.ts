import { ProcessamentoParaleloService } from '../src/processamento-paralelo/processamento-paralelo.service.ts';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  const service = new ProcessamentoParaleloService();

  const imagens = Array.from({ length: 100 }, (_, indice) =>
    join(
      __dirname,
      `../imagens-teste/objeto${(indice % 3) + 1}.jpg`,
    ),
  );

  console.log('=== COMPARAÇÃO DE PROCESSAMENTO ===');

  const sequencial = await service.processarSequencial(imagens);
  console.log('Sequencial:', sequencial);

  const paralelo = await service.processarParalelo(imagens);
  console.log('Paralelo:', paralelo);

  console.log(
    'Speedup:',
    (sequencial.tempoMs / paralelo.tempoMs).toFixed(2) + 'x',
  );
}

main().catch((erro) => {
  console.error('Erro:', erro);
  process.exitCode = 1;
});