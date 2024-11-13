import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

const execPromise = util.promisify(exec);

@Injectable()
export class VideoConverterService {
  private readonly tmpDir = 'tmp';

  constructor() {
    if (!fs.existsSync(this.tmpDir)) {
      fs.mkdirSync(this.tmpDir);
    }
  }

  async convertToMp4(buffer: Buffer, originalMimetype: string): Promise<{ buffer: Buffer; mimetype: string }> {
    // Si ya es MP4, retornamos el buffer original
    if (originalMimetype === 'video/mp4') {
      return { buffer, mimetype: originalMimetype };
    }

    try {
      const inputPath = path.join(this.tmpDir, `${Date.now()}_input`);
      const outputPath = path.join(this.tmpDir, `${Date.now()}_converted.mp4`);

      // Guardar archivo temporalmente
      fs.writeFileSync(inputPath, buffer);

      // Convertir video
      await execPromise(`ffmpeg -i ${inputPath} -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k ${outputPath}`);

      // Leer el archivo convertido
      const convertedBuffer = fs.readFileSync(outputPath);

      // Limpiar archivos temporales
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);

      return {
        buffer: convertedBuffer,
        mimetype: 'video/mp4'
      };
    } catch (error) {
      throw new Error(`Error al convertir video: ${error.message}`);
    }
  }
}
