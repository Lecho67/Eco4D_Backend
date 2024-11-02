import { Injectable } from '@nestjs/common';
import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AzureBlobService {
  private readonly containerName: string;

  constructor(private readonly configService: ConfigService) {
    this.containerName = this.configService.get<string>('AZURE_STORAGE_CONTAINER_NAME');
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

    return blobClient.url;
  }
}