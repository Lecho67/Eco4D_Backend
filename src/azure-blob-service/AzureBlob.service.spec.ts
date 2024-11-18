import { Test, TestingModule } from '@nestjs/testing';
import { AzureBlobService } from './AzureBlob.service';
import { ConfigService } from '@nestjs/config';
import { VideoConverterService } from '../video-converter/video-converter.service';

describe('AzureBlobService', () => {
  let azureBlobService: AzureBlobService;
  let mockConfigService: ConfigService;
  let mockVideoConverterService: VideoConverterService;

  beforeEach(async () => {
    mockConfigService = {
      get: jest.fn((key) => {
        const config = {
          AZURE_STORAGE_CONTAINER_NAME: 'test-container',
          AZURE_STORAGE_CONNECTION_STRING: 'test-connection-string',
          AZURE_STORAGE_ACCOUNT_NAME: 'test-account',
          AZURE_STORAGE_ACCOUNT_KEY: 'test-key',
        };
        return config[key];
      }),
    } as any;

    mockVideoConverterService = {
      convertToMp4: jest.fn().mockResolvedValue({
        buffer: Buffer.from('converted-video'),
        mimetype: 'video/mp4',
      }),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AzureBlobService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: VideoConverterService, useValue: mockVideoConverterService },
      ],
    }).compile();

    azureBlobService = module.get<AzureBlobService>(AzureBlobService);
  });

  it('should sanitize file names correctly', () => {
    const sanitized = azureBlobService['sanitizeFileName']('Test File@123.mp4');
    expect(sanitized).toMatch(/test-file123-\d+\.mp4/);
  });

  it('should generate a valid SAS URL', () => {
    const url = azureBlobService.generateSasUrl('test-blob');
    expect(url).toContain('test-account.blob.core.windows.net');
    expect(url).toContain('test-container');
  });

  it('should upload a video file and convert it to MP4', async () => {
    const file = {
      buffer: Buffer.from('test-video'),
      mimetype: 'video/avi',
      originalname: 'test.avi',
    } as Express.Multer.File;

    const blobName = await azureBlobService.upload(file);
    expect(mockVideoConverterService.convertToMp4).toHaveBeenCalled();
    expect(blobName).toMatch(/test-\d+\.mp4/);
  });
});