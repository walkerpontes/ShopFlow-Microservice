import { Prisma } from '@/apps/ms-products/src/generated/prisma';
import { MsProductService } from '@/apps/ms-products/src/ms-product.service';
import { PrismaService } from '@/apps/ms-products/src/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('Product Service', () => {
  let service: MsProductService;

  const changeStatus = {
    id: 1,
    ativo: true,
  };

  const result = {
    id: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    preco: 10.99,
    nome: 'Product Test',
    descricao: 'Description Product Test',
    ativo: true,
  };

  const productDto = {
    nome: 'Product Test',
    descricao: 'Description Product Test',
    preco: 10.99,
    quantidade: 10,
  };

  const productPatchDefaultDto = {
    id: 1,
    product: {
      nome: 'Product Test',
    },
  };

  const prismaMock = {
    product: {
      update: jest.fn().mockResolvedValue(result),
      delete: jest.fn().mockResolvedValue(result),
      create: jest.fn().mockResolvedValue(result),
      findUniqueOrThrow: jest.fn().mockResolvedValue(result),
      findMany: jest.fn().mockResolvedValue([result, result]),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MsProductService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get(MsProductService);
  });

  it('Change: sucess', async () => {
    const rslt = await service.Change(changeStatus);

    expect(rslt).toEqual(result);
  });

  it('Change: fail', async () => {
    prismaMock.product.update.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Error Prisma', {
        code: 'P2025',
        clientVersion: '5.0.0',
      }),
    );

    await expect(service.Change(changeStatus)).rejects.toThrow(
      'Register not found',
    );
  });

  it('Delete: sucess', async () => {
    const rslt = await service.Delete(1);
    expect(rslt).toEqual(result);
    expect(prismaMock.product.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('Delete: fail', async () => {
    prismaMock.product.delete.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Error Prisma', {
        code: 'P2025',
        clientVersion: '5.0.0',
      }),
    );

    await expect(service.Delete(1)).rejects.toThrow('Register not found');
  });

  it('Create: sucess', async () => {
    const rslt = await service.Create(productDto);

    expect(rslt).toEqual(result);
    expect(prismaMock.product.create).toHaveBeenCalledWith({
      data: {
        nome: productDto.nome,
        descricao: productDto.descricao,
        preco: productDto.preco,
        ativo: true,
      },
    });
  });

  it('Create: fail', async () => {
    prismaMock.product.create.mockResolvedValue(null);

    await expect(service.Create(productDto)).rejects.toThrow(
      'No products was found',
    );
  });

  it('FindId: sucess', async () => {
    const rslt = await service.FindId(1);
    expect(rslt).toEqual(result);
    expect(prismaMock.product.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('FindId: fail', async () => {
    prismaMock.product.findUniqueOrThrow.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Error Prisma', {
        code: 'P2025',
        clientVersion: '5.0.0',
      }),
    );

    await expect(service.FindId(1)).rejects.toThrow('Register not found');
  });

  it('All: sucess', async () => {
    const rslt = await service.All();
    expect(rslt).toEqual([result, result]);
  });

  it('All: fail', async () => {
    prismaMock.product.findMany.mockResolvedValue([]);

    await expect(service.All()).rejects.toThrow('No products was found');
  });

  it('Patch: sucess', async () => {
    prismaMock.product.update.mockResolvedValue(result);
    const rslt = await service.Patch(productPatchDefaultDto);
    expect(rslt).toEqual(result);
    expect(prismaMock.product.update).toHaveBeenCalledWith({
      where: { id: productPatchDefaultDto.id },
      data: productPatchDefaultDto.product,
    });
  });

  it('Patch: fail', async () => {
    prismaMock.product.update.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Error Prisma', {
        code: 'P2025',
        clientVersion: '5.0.0',
      }),
    );

    await expect(service.Patch(productPatchDefaultDto)).rejects.toThrow(
      'Register not found',
    );
  });
});
