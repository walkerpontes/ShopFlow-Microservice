import { Test, TestingModule } from '@nestjs/testing';
import { MsAuthService } from '../../apps/ms-auth/src/ms-auth.service';
import { PrismaService } from '@/apps/ms-auth/src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { Prisma } from '@/apps/ms-auth/src/generated/prisma';

jest.mock('argon2', () => ({
  verify: jest.fn(),
  hash: jest.fn(),
}));

describe('Test Auth Service', () => {
  let service: MsAuthService;
  const prismaMock = {
    user: {
      findUniqueOrThrow: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
  };
  const jwtMock = {
    signAsync: jest.fn(),
  };

  const userLogin = {
    email: 'test@email.com',
    pass: 'pass',
  };

  const userReg = {
    name: 'test',
    email: 'test@email.com',
    pass: 'pass',
  };

  const userBD = {
    id: 1,
    email: 'test@email.com',
    nome: 'test',
    pass: 'hashed-pass',
    role: 'USER',
    createdAt: new Date(),
  };

  const userCreated = {
    email: 'test@email.com',
    nome: 'test',
    role: 'USER',
    createdAt: new Date(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MsAuthService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: JwtService, useValue: jwtMock },
      ],
    }).compile();

    service = module.get<MsAuthService>(MsAuthService);
  });

  it('Login: sucess', async () => {
    prismaMock.user.findUniqueOrThrow.mockResolvedValue(userBD);
    (argon2.verify as jest.Mock).mockResolvedValue(true);
    jwtMock.signAsync.mockResolvedValue('token');

    const result = await service.Login(userLogin);

    expect(result).toEqual({ token: 'token' });
    expect(prismaMock.user.findUniqueOrThrow).toHaveBeenCalledWith({
      where: {
        email: 'test@email.com',
      },
    });
    expect(jwtMock.signAsync).toHaveBeenCalledWith({
      sub: 1,
      name: userBD.nome,
      email: userBD.email,
      role: userBD.role,
    });
    expect(argon2.verify).toHaveBeenCalledWith(userBD.pass, userLogin.pass);
  });

  it('Login: pass error', async () => {
    prismaMock.user.findUniqueOrThrow.mockResolvedValue(userBD);
    (argon2.verify as jest.Mock).mockResolvedValue(false);
    await expect(service.Login(userLogin)).rejects.toThrow();
  });

  it('Login: user not found', async () => {
    prismaMock.user.findUniqueOrThrow.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('An error message from Prisma', {
        code: 'P2025',
        clientVersion: '5.0.0',
      }),
    );
    await expect(service.Login(userLogin)).rejects.toThrow(
      'Register not found',
    );
  });

  it('Register: sucess', async () => {
    (argon2.hash as jest.Mock).mockResolvedValue('hashed');
    prismaMock.user.create.mockResolvedValue(userCreated);
    const result = await service.Register(userReg);
    expect(result).toEqual(userCreated);
  });

  it('Register: create fail', async () => {
    (argon2.hash as jest.Mock).mockResolvedValue('hashed');
    prismaMock.user.create.mockResolvedValue(null);
    await expect(service.Register(userReg)).rejects.toThrow(
      'Created User failed',
    );
  });

  it('FindAllUsers: sucess', async () => {
    prismaMock.user.findMany.mockResolvedValue(userCreated);
    const result = await service.FindAllUsers();
    expect(result).toEqual(userCreated);
  });

  it('FindAllUsers: no users in Db', async () => {
    prismaMock.user.findMany.mockResolvedValue([]);
    await expect(service.FindAllUsers()).rejects.toThrow('Not found users');
  });

  it('FindUserId: sucess', async () => {
    prismaMock.user.findUniqueOrThrow.mockResolvedValue(userCreated);
    const result = await service.FindUserId(1);
    expect(result).toEqual(userCreated);
    expect(prismaMock.user.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id: 1 },
      omit: { id: true, pass: true },
    });
  });

  it('FindUserId: fail', async () => {
    prismaMock.user.findUniqueOrThrow.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('An error message from Prisma', {
        code: 'P2025',
        clientVersion: '5.0.0',
      }),
    );
    await expect(service.FindUserId(1)).rejects.toThrow('Register not found');
  });

  it('Patch: sucess', async () => {
    (argon2.hash as jest.Mock).mockResolvedValue('hashed');

    prismaMock.user.update.mockResolvedValue(userCreated);
    const result = await service.Patch({ id: 1, user: userLogin });
    expect(result).toEqual(userCreated);
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: userLogin,
      omit: { id: true, pass: true },
    });
  });

  it('Patch: fail', async () => {
    prismaMock.user.update.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('An error message from Prisma', {
        code: 'P2025',
        clientVersion: '5.0.0',
      }),
    );
    await expect(service.Patch({ id: 1, user: userLogin })).rejects.toThrow(
      'An error message from Prisma',
    );
  });
});
