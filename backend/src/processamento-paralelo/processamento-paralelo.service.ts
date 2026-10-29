import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { performance } from 'node:perf_hooks';
import { Worker } from 'node:worker_threads';
import { availableParallelism } from 'node:os';
import { fileURLToPath } from 'node:url';

@Injectable()
export class ProcessamentoParaleloService {
  async processarSequencial(
    imagens: string[],
  ) {
    const inicio = performance.now();

    for (const imagem of imagens) {
      await sharp(imagem)
        .resize(800, 600, { fit: 'inside' })
        .grayscale()
        .toBuffer();
    }

    const tempo = performance.now() - inicio;

    return {
      modo: 'sequencial',
      imagensProcessadas: imagens.length,
      tempoMs: Number(tempo.toFixed(2)),
    };
  }

  private executarWorker(imagens: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const usandoTypeScript = import.meta.url.endsWith('.ts');
      const extensaoWorker = usandoTypeScript ? 'ts' : 'js';
      const worker = new Worker(
        fileURLToPath(
          new URL(`./imagem.worker.${extensaoWorker}`, import.meta.url),
        ),
        {
          workerData: imagens,
          execArgv: usandoTypeScript ? ['--import', 'tsx'] : [],
        },
      );

      let recebeuResultado = false;

      worker.on('message', (resultado) => {
        recebeuResultado = true;

        if (resultado.sucesso) {
          resolve();
        } else {
          reject(new Error(resultado.erro));
        }
      });

      worker.on('error', reject);

      worker.on('exit', (codigo) => {
        if (codigo !== 0) {
          reject(new Error(`Worker finalizado com código ${codigo}`));
        } else if (!recebeuResultado) {
          reject(new Error('Worker finalizado sem retornar resultado'));
        }
      });
    });
  }

  async processarParalelo(imagens: string[]) {
    const inicio = performance.now();

    const quantidadeWorkers = Math.min(
      4,
      availableParallelism(),
      imagens.length,
    );

    const lotes = Array.from(
      { length: quantidadeWorkers },
      () => [] as string[],
    );

    imagens.forEach((imagem, indice) => {
      lotes[indice % quantidadeWorkers].push(imagem);
    });

    await Promise.all(lotes.map((lote) => this.executarWorker(lote)));

    return {
      modo: 'paralelo',
      imagensProcessadas: imagens.length,
      workers: quantidadeWorkers,
      tempoMs: Number((performance.now() - inicio).toFixed(2)),
    };
  }
}