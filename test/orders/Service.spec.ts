import { MsOrdersService } from '@/apps/ms-orders/src/ms-orders.service';
import { PrismaService } from '@/apps/ms-orders/src/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { Prisma } from '@/apps/ms-orders/src/generated/prisma';
import { PaymentMethod } from '@/lib/dto/PaymentDto';

describe('Order Service', () => {
  let service: MsOrdersService;

  const ResultAllOrder = [
    {
      id: 1,
      createdAt: new Date(),
      userId: 1,
      status: 'PEDING',
      total: 2,
      updatedAt: new Date(),
      items: [
        {
          id: 1,
          orderId: 1,
          produtoId: 1,
          nomeProduto: 1,
          preco: 1,
          quantidade: 2,
        },
      ],
    },
  ];

  const ResultUniqueOrder = {
    id: 1,
    createdAt: new Date(),
    userId: 1,
    status: 'PEDING',
    total: 1,
    updatedAt: new Date(),
    items: [
      {
        id: 1,
        orderId: 1,
        produtoId: 1,
        nomeProduto: 1,
        preco: 1,
        quantidade: 1,
      },
    ],
  };

  const CreateOrderDto = {
    userId: 1,
    items: [
      {
        produtoId: 1,
        nomeProduto: 'test',
        preco: 1.99,
        quantidade: 1,
      },
    ],
    method: PaymentMethod.PIX,
  };

  const ResultPay = {
    idPayment: 1,
    idOrder: 1,
  };

  const ResultPaymentDto = {
    id: 1,
    status: 'PEDING',
    createdAt: new Date(),
    orderId: 1,
    valor: 1,
    method: 'PIX',
    data: {
      pixCode: 'code',
      qrCode: 'qrcode',
    },
  };

  const ResultFailOrder = {
    id: 1,
    createdAt: new Date(),
    userId: 1,
    status: 'CANCELED',
    total: 1,
    updatedAt: new Date(),
  };

  const prismaMock = {
    order: {
      findMany: jest.fn().mockResolvedValue(ResultAllOrder),
      findUniqueOrThrow: jest.fn().mockResolvedValue(ResultUniqueOrder),
      create: jest.fn().mockResolvedValue(ResultUniqueOrder),
      update: jest.fn(),
    },
  };

  const StockClientproxy = {
    send: jest.fn(),
  };
  const StockClientproxyRmq = {
    emit: jest.fn(),
  };
  const PaymentClientproxy = {
    send: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MsOrdersService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: 'STOCK_SERVICE',
          useValue: StockClientproxy,
        },
        {
          provide: 'STOCK_SERVICE_RMQ',
          useValue: StockClientproxyRmq,
        },
        {
          provide: 'PAYMENT_SERVICE',
          useValue: PaymentClientproxy,
        },
      ],
    }).compile();

    service = module.get(MsOrdersService);
  });

  it('FindAllOrder: sucess', async () => {
    const result = await service.findAllOrder();
    expect(result).toEqual(ResultAllOrder);
  });

  it('FindAllOrder: no Order in Db', async () => {
    prismaMock.order.findMany.mockResolvedValue([]);
    await expect(service.findAllOrder()).rejects.toThrow('No order was found.');
  });

  it('FindOrderId: sucess', async () => {
    const result = await service.findOrderId(1);
    expect(result).toEqual(ResultUniqueOrder);
    expect(prismaMock.order.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id: 1 },
      include: { items: true },
    });
  });

  it('FindOrderId: order not found', async () => {
    prismaMock.order.findMany.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Error Prisma', {
        code: 'P2025',
        clientVersion: '5.0.0',
      }),
    );
    await expect(service.findAllOrder()).rejects.toThrow('Register not found');
  });

  it('CreateOrder: sucess', async () => {
    StockClientproxy.send.mockReturnValue(of({ sucess: true }));
    PaymentClientproxy.send.mockReturnValue(of(ResultPaymentDto));
    const result = await service.createOrder(CreateOrderDto);
    expect(result).toEqual({ ...ResultUniqueOrder, payment: ResultPaymentDto });
  });

  it('CreateOrder: no stock', async () => {
    StockClientproxy.send.mockReturnValue(of({ sucess: false }));
    PaymentClientproxy.send.mockReturnValue(of(ResultPaymentDto));
    const result = await service.createOrder(CreateOrderDto);
    expect(result).toEqual({ ...ResultUniqueOrder, sucess: false });
  });

  it('OrderFail: sucess', async () => {
    prismaMock.order.update.mockResolvedValue(ResultFailOrder);
    await service.OrderFail(ResultPay);
    expect(prismaMock.order.update).toHaveBeenCalledWith({
      where: { id: ResultPay.idOrder },
      data: { status: 'CANCELED' },
    });
  });

  it('OrderFail: no order', async () => {
    prismaMock.order.update.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Error Prisma', {
        code: 'P2025',
        clientVersion: '5.0.0',
      }),
    );
    await expect(service.OrderFail(ResultPay)).rejects.toThrow(
      'Register not found',
    );
  });

  it('OrderSucess: sucess', async () => {
    prismaMock.order.update.mockResolvedValue(ResultFailOrder);
    StockClientproxyRmq.emit.mockReturnValue(of(true));
    await service.OrderSucess(ResultPay);
    expect(prismaMock.order.update).toHaveBeenCalledWith({
      where: { id: ResultPay.idOrder },
      data: { status: 'PAID' },
      include: { items: true },
    });
  });

  it('OrderSucess: no order', async () => {
    prismaMock.order.update.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Error Prisma', {
        code: 'P2025',
        clientVersion: '5.0.0',
      }),
    );
    await expect(service.OrderSucess(ResultPay)).rejects.toThrow(
      'Register not found',
    );
  });
});
