import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let prismaService: PrismaService;

  beforeEach(() => {
    prismaService = new PrismaService();
  });

  it('should connect to the database on module initialization', async () => {
    jest.spyOn(prismaService, '$connect').mockResolvedValueOnce();
    await prismaService.onModuleInit();
    expect(prismaService.$connect).toHaveBeenCalled();
  });
});