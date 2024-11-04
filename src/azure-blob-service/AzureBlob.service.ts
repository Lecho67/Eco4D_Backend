import { Injectable, ForbiddenException } from '@nestjs/common';
import { BlobServiceClient, BlockBlobClient, generateBlobSASQueryParameters, BlobSASPermissions, StorageSharedKeyCredential } from '@azure/storage-blob';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AzureBlobService {
  private readonly containerName: string;
  private readonly accountName: string;
  private readonly accountKey: string;

  constructor(
    private readonly configService: ConfigService,
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

  async upload(file: Express.Multer.File): Promise<string> {
    const fileName = `${Date.now()}-${file.originalname}`;
    const blobClient = this.getBlobClient(fileName);
    
    await blobClient.uploadData(file.buffer, {
      blobHTTPHeaders: { blobContentType: file.mimetype }
    });

    return fileName; // Retornamos solo el nombre del archivo en lugar de la URL
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