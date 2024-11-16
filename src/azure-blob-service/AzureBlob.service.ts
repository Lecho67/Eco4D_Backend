import { Injectable, ForbiddenException } from '@nestjs/common';
import { BlobServiceClient, BlockBlobClient, generateBlobSASQueryParameters, BlobSASPermissions, StorageSharedKeyCredential } from '@azure/storage-blob';
import { ConfigService } from '@nestjs/config';
import { VideoConverterService } from 'src/video-converter/video-converter.service';
@Injectable()
export class AzureBlobService {
  private readonly containerName: string;
  private readonly accountName: string;
  private readonly accountKey: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly videoConverterService: VideoConverterService
  ) {
    this.containerName = this.configService.get<string>('AZURE_STORAGE_CONTAINER_NAME');
    this.accountName = this.configService.get<string>('AZURE_STORAGE_ACCOUNT_NAME');
    this.accountKey = this.configService.get<string>('AZURE_STORAGE_ACCOUNT_KEY');
  }

  private getBlobClient(imageName: string): BlockBlobClient {
    const blobClientService = BlobServiceClient.fromConnectionString(
      this.configService.get<string>('AZURE_STORAGE_CONNECTION_STRING')
    );
    const containerClient = blobClientService.getContainerClient(this.containerName);
    return containerClient.getBlockBlobClient(imageName);
  }
  private sanitizeFileName(fileName: string): string {
    // Remueve caracteres especiales y espacios, solo permite letras, números, guiones y puntos
    let sanitized = fileName
      .toLowerCase() // Convierte a minúsculas
      .normalize('NFD') // Normaliza caracteres acentuados
      .replace(/[\u0300-\u036f]/g, '') // Remueve diacríticos
      .replace(/[^a-z0-9.-]/g, '-') // Reemplaza caracteres inválidos con guiones
      .replace(/-+/g, '-') // Reemplaza múltiples guiones con uno solo
      .replace(/^-+|-+$/g, ''); // Remueve guiones al inicio y final

    // Asegura que el nombre del archivo no exceda 1024 caracteres (límite de Azure)
    const timestamp = Date.now();
    const extension = sanitized.split('.').pop() || '';
    const nameWithoutExt = sanitized.replace(/\.[^/.]+$/, '');
    
    // Si el nombre es muy largo, lo trunca y agrega el timestamp
    if (nameWithoutExt.length > 50) {
      sanitized = `${nameWithoutExt.substring(0, 50)}-${timestamp}.${extension}`;
    } else {
      sanitized = `${nameWithoutExt}-${timestamp}.${extension}`;
    }

    return sanitized;
  }
  async upload(file: Express.Multer.File): Promise<string> {
    let fileBuffer = file.buffer;
    let mimeType = file.mimetype;
    let fileName = this.sanitizeFileName(file.originalname);

    // Si es un video, convertir a MP4
    if (mimeType.startsWith('video/')) {
      const convertedVideo = await this.videoConverterService.convertToMp4(fileBuffer, mimeType);
      fileBuffer = convertedVideo.buffer;
      mimeType = convertedVideo.mimetype;
      // Asegurarnos que el nombre del archivo termine en .mp4
      fileName = fileName.replace(/[^\w\d.-]/g, '');  // Solo permite letras, números, guiones y puntos

      // Ahora cambiar la extensión
      fileName = fileName.replace(/\.[^/.]+$/, '.mp4');
    }

    const blobClient = this.getBlobClient(fileName);
    
    await blobClient.uploadData(fileBuffer, {
      blobHTTPHeaders: { blobContentType: mimeType }
    });

    return fileName;
  }
  generateSasUrl(blobName: string): string {
    const sharedKeyCredential = new StorageSharedKeyCredential(
      this.accountName,
      this.accountKey
    );

    const startsOn = new Date();
    const expiresOn = new Date(new Date().valueOf() + 86400 * 1000 * 10); // URL válida por 1 hora

    const sasOptions = {
      containerName: this.containerName,
      blobName: blobName,
      permissions: BlobSASPermissions.parse('r'), // Solo lectura
      startsOn: startsOn,
      expiresOn: expiresOn,
    };

    const sasToken = generateBlobSASQueryParameters(
      sasOptions,
      sharedKeyCredential
    ).toString();

    return `https://${this.accountName}.blob.core.windows.net/${this.containerName}/${blobName}?${sasToken}`;
  }
}