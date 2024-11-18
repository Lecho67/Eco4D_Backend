import { Test, TestingModule } from '@nestjs/testing';
import { AzureBlobService } from './AzureBlob.service';
import { ConfigService } from '@nestjs/config';
import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { BadRequestException } from '@nestjs/common';
import { VideoConverterService } from '../video-converter/video-converter.service';

jest.mock('@azure/storage-blob');

describe('AzureBlobService', () => {
  let service: AzureBlobService;
  let configService: ConfigService;
  let mockBlobServiceClient;
  let mockContainerClient;
  let mockBlockBlobClient;
  let mockVideoConverterService;

  beforeEach(async () => {
    // Mock implementations
    mockBlockBlobClient = {
      uploadData: jest.fn().mockResolvedValue({}),
    };

    mockContainerClient = {
      getBlockBlobClient: jest.fn().mockReturnValue(mockBlockBlobClient)
    };

    mockBlobServiceClient = {
      getContainerClient: jest.fn().mockReturnValue(mockContainerClient)
    };

    mockVideoConverterService = {
      convertToMp4: jest.fn().mockImplementation((buffer, mimetype) => 
        Promise.resolve({
          buffer: buffer,
          mimetype: 'video/mp4'
        })
      ),
      isVideoFile: jest.fn().mockImplementation((mimetype) => mimetype.startsWith('video/'))
    };

    (BlobServiceClient.fromConnectionString as jest.Mock).mockReturnValue(mockBlobServiceClient);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AzureBlobService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config = {
                'AZURE_STORAGE_CONNECTION_STRING': 'DefaultEndpointsProtocol=https;AccountName=test;AccountKey=test;EndpointSuffix=core.windows.net',
                'AZURE_STORAGE_CONTAINER_NAME': 'test-container',
                'AZURE_STORAGE_ACCOUNT_NAME': 'test',
                'AZURE_STORAGE_ACCOUNT_KEY': 'test-key'
              };
              return config[key];
            })
          }
        },
        {
          provide: VideoConverterService,
          useValue: mockVideoConverterService
        }
      ],
    }).compile();

    service = module.get<AzureBlobService>(AzureBlobService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('upload', () => {
    it('should upload a video file successfully', async () => {
      const mockBuffer = Buffer.from('test video content');
      const mockFile = {
        originalname: 'test-video.mp4',
        buffer: mockBuffer,
        mimetype: 'video/mp4'
      };

      mockVideoConverterService.isVideoFile.mockReturnValueOnce(true);
      const result = await service.upload(mockFile as Express.Multer.File);
      
      // Verificar que el nombre del archivo sigue el patrón esperado (nombre-timestamp.mp4)
      expect(result).toMatch(/test-video-\d+\.mp4/);
      expect(mockVideoConverterService.convertToMp4).toHaveBeenCalledWith(mockBuffer, 'video/mp4');
      expect(mockBlockBlobClient.uploadData).toHaveBeenCalled();
    });

    it('should upload non-video files', async () => {
      const mockFile = {
        originalname: 'test-doc.pdf',
        buffer: Buffer.from('test content'),
        mimetype: 'application/pdf'
      };

      const result = await service.upload(mockFile as Express.Multer.File);
      expect(result).toMatch(/test-doc-\d+\.pdf/);
      expect(mockVideoConverterService.convertToMp4).not.toHaveBeenCalled();
    });

    it('should throw TypeError for missing file', async () => {
      await expect(service.upload(null))
        .rejects
        .toThrow(TypeError);
    });

    it('should handle empty buffer correctly', async () => {
      const mockFile = {
        originalname: 'test-video.mp4',
        buffer: Buffer.from(''),
        mimetype: 'video/mp4'
      };

      mockVideoConverterService.isVideoFile.mockReturnValueOnce(true);
      
      const result = await service.upload(mockFile as Express.Multer.File);
      expect(result).toMatch(/test-video-\d+\.mp4/);
    });
  });

  describe('getBlobClient', () => {
    it('should return a BlockBlobClient', () => {
      const blobName = 'test-video.mp4';
      const result = service['getBlobClient'](blobName);
      
      expect(result).toBeDefined();
      expect(mockBlobServiceClient.getContainerClient).toHaveBeenCalledWith('test-container');
      expect(mockContainerClient.getBlockBlobClient).toHaveBeenCalledWith(blobName);
      expect(result).toBe(mockBlockBlobClient);
    });
  });
});