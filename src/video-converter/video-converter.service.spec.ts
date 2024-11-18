import { Test, TestingModule } from '@nestjs/testing';
import { VideoConverterService } from './video-converter.service';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

jest.mock('util', () => ({
  ...jest.requireActual('util'),
  promisify: jest.fn().mockImplementation(() => jest.fn().mockResolvedValue({ stdout: '', stderr: '' })),
}));

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  writeFileSync: jest.fn(),
  readFileSync: jest.fn(),
  unlinkSync: jest.fn(),
}));

describe('VideoConverterService', () => {
  let service: VideoConverterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VideoConverterService],
    }).compile();

    service = module.get<VideoConverterService>(VideoConverterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should convert video to mp4', async () => {
    const buffer = Buffer.from('contenido de prueba AVI');
    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(buffer);

    const result = await service.convertToMp4(buffer, 'video/avi');
    expect(result.mimetype).toBe('video/mp4');
    expect(result.buffer).toBeDefined();
  });

  it('should return original buffer if already mp4', async () => {
    const buffer = Buffer.from('contenido de prueba MP4');
    jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(buffer);

    const result = await service.convertToMp4(buffer, 'video/mp4');
    expect(result.mimetype).toBe('video/mp4');
    expect(result.buffer).toEqual(buffer);
  });

  it('should throw an error if conversion fails', async () => {
    jest.spyOn(fs, 'writeFileSync').mockImplementationOnce(() => {
      throw new Error('Mock error');
    });

    const buffer = Buffer.from([]);
    await expect(service.convertToMp4(buffer, 'video/avi')).rejects.toThrow('Error al convertir video: Mock error');
  });
});