import { parentPort, workerData } from 'node:worker_threads';
import sharp from 'sharp';

sharp.concurrency(1);

async function processarImagem() {
  try {
    const imagens = workerData as string[];

    for (const imagem of imagens) {
      await sharp(imagem)
        .resize(800, 600, { fit: 'inside' })
        .grayscale()
        .toBuffer();
    }

    parentPort?.postMessage({
      sucesso: true,
      imagensProcessadas: imagens.length,
    });
  } catch (erro) {
    parentPort?.postMessage({
      sucesso: false,
      erro: String(erro),
    });
  }
}

processarImagem();