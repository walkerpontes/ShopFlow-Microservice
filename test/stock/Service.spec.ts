import { Prisma } from '@/apps/ms-stock/src/generated/prisma';
import { MsStockService } from '@/apps/ms-stock/src/ms-stock.service';
import { PrismaService } from '@/apps/ms-stock/src/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('Stock Service', () => {
  let service: MsStockService;

  const orderItemsDto = [
    {
      produtoId: 1,
      nomeProduto: 'Test product',
      preco: 10.99,
      quantidade: 1,
    },
  ];
  const orderItemsDtoFail = [
    {
      produtoId: 1,
      nomeProduto: 'Test product',
      preco: 10.99,
      quantidade: 11,
    },
  ];

  const resultStock = {
    id: 1,
    updatedAt: new Date(),
    quantidade: 10,
    productId: 1,
  };

  const resultMovementStock = {
    id: 1,
    createdAt: new Date(),
    quantidade: 1,
    productId: 1,
    type: 'ENTRY',
  };

  const Items = [
    {
      id: 1,
      quantidade: 1,
      orderId: 1,
      produtoId: 1,
      nomeProduto: 'Test Product',
      preco: 10.99,
    },
  ];

  const stock = {
    productId: 1,
    quantidade: 1,
  };

  const prismaMock = {
    stock: {
      findUniqueOrThrow: jest.fn().mockResolvedValue(resultStock),
      update: jest.fn().mockResolvedValue(resultStock),
      create: jest.fn().mockResolvedValue(resultStock),
    },
    stockMovement: {
      create: jest.fn().mockResolvedValue(resultMovementStock),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MsStockService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get(MsStockService);

    jest.clearAllMocks();
  });

  it('VerifyStock: sucess', async () => {
    const result = await service.VerifyStock(orderItemsDto);

    expect(result).toEqual({ sucess: true });
  });

  it('VerifyStock: no stock', async () => {
    const result = await service.VerifyStock(orderItemsDtoFail);

    expect(result).toEqual({
      sucess: false,
      itemFailed: orderItemsDtoFail[0],
      description: `${orderItemsDtoFail[0].nomeProduto} Insufficient stock`,
    });
  });

  it('VerifyStock: fail', async () => {
    prismaMock.stock.findUniqueOrThrow.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Error Prisma', {
        code: 'P2025',
        clientVersion: '5.0.0',
      }),
    );
    await expect(service.VerifyStock(orderItemsDto)).rejects.toThrow(
      'Register not found',
    );
  });

  it('StockReduction: sucess', async () => {
    await service.StockReduction(Items);
    expect(prismaMock.stock.update).toHaveBeenCalledWith({
      where: { productId: Items[0].produtoId },
      data: { quantidade: { decrement: Items[0].quantidade } },
    });
    expect(prismaMock.stockMovement.create).toHaveBeenCalledWith({
      data: {
        productId: Items[0].produtoId,
        quantidade: Items[0].quantidade,
        type: 'EXIT',
      },
    });
  });

  it('StockReduction: fail', async () => {
    prismaMock.stock.update.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Error Prisma', {
        code: 'P2025',
        clientVersion: '5.0.0',
      }),
    );
    await expect(service.StockReduction(Items)).rejects.toThrow(
      'Register not found',
    );
  });

  it('Create: sucess', async () => {
    await service.Create(stock);
    expect(prismaMock.$transaction).toBeDefined();
  });

  it('Create: fail', async () => {
    prismaMock.$transaction.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Error Prisma', {
        code: 'P2002',
        clientVersion: '5.0.0',
      }),
    );
    await expect(service.Create(stock)).rejects.toThrow(
      'Duplication of unique values',
    );
  });

  it('ChangeQuant: sucess', async () => {
    prismaMock.stock.update.mockResolvedValue(resultStock);
    prismaMock.stockMovement.create.mockResolvedValue(resultMovementStock);
    const result = await service.ChangeQuant(stock);
    expect(result).toEqual(resultStock);
  });

  it('ChangeQuant: fail', async () => {
    prismaMock.stock.update.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Error Prisma', {
        code: 'P2025',
        clientVersion: '5.0.0',
      }),
    );
    await expect(service.ChangeQuant(stock)).rejects.toThrow(
      'Register not found',
    );
  });
});
