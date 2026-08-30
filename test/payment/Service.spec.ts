import { Prisma } from '@/apps/ms-payment/src/generated/prisma';
import { MsPaymentService } from '@/apps/ms-payment/src/ms-payment.service';
import { PrismaService } from '@/apps/ms-payment/src/prisma/prisma.service';
import { PaymentMethod, StatusPayment } from '@/lib/dto/PaymentDto';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';

describe('Payment Service', () => {
  let service: MsPaymentService;

  const create = {
    id: 1,
    status: StatusPayment.PEDING,
    createdAt: new Date(),
    orderId: 1,
    valor: 10.99,
    metodo: PaymentMethod.PIX,
  };

  const update = {
    id: 1,
    status: StatusPayment.PEDING,
    createdAt: new Date(),
    orderId: 1,
    valor: 10.99,
    metodo: PaymentMethod.PIX,
  };

  const receivedPayment = {
    orderId: 1,
    valor: 10.99,
    method: PaymentMethod.PIX,
  };

  const resultPay = {
    idPayment: 1,
    idOrder: 1,
  };

  const prismaMock = {
    payment: {
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  const orderClientproxy = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MsPaymentService,
        { provide: 'ORDER_SERVICE', useValue: orderClientproxy },
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get(MsPaymentService);
  });

  it('CreatePayment: sucess', async () => {
    prismaMock.payment.create.mockResolvedValue(create);
    const result = await service.CreatePayment(receivedPayment);
    const data = { pixCode: 'pixcodetest', qrCode: 'qrcodetest' };
    expect(result).toEqual({ ...create, ...data });
    expect(prismaMock.payment.create).toHaveBeenCalledWith({
      data: {
        orderId: receivedPayment.orderId,
        valor: receivedPayment.valor,
        status: 'PEDING',
        metodo: receivedPayment.method,
      },
    });
  });

  it('CreatePayment: fail', async () => {
    prismaMock.payment.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Error Prisma', {
        code: 'P2025',
        clientVersion: '5.0.0',
      }),
    );
    await expect(service.CreatePayment(receivedPayment)).rejects.toThrow(
      'Register not found',
    );
  });

  it('ProcessPayment: Pix method', () => {
    const result = service.ProcessPayment(PaymentMethod.PIX);
    expect(result).toEqual({ pixCode: 'pixcodetest', qrCode: 'qrcodetest' });
  });

  it('ProcessPayment: Credit Card method', () => {
    const result = service.ProcessPayment(PaymentMethod.CREDIT_CARD);
    expect(result).toEqual({ tokenCard: 'tokencredittest' });
  });

  it('ProcessPayment: Debit Card method', () => {
    const result = service.ProcessPayment(PaymentMethod.DEBIT_CARD);
    expect(result).toEqual({ tokenCard: 'tokendebittest' });
  });

  it('PaymentFail: sucess', async () => {
    prismaMock.payment.update.mockResolvedValue(update);
    orderClientproxy.emit.mockReturnValue(of(true));
    await service.PaymentFail(resultPay);
    expect(prismaMock.payment.update).toHaveBeenCalledWith({
      where: { id: resultPay.idPayment },
      data: {
        status: 'REJECTED',
      },
    });
  });

  it('PaymentFail: fail', async () => {
    prismaMock.payment.update.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Error Prisma', {
        code: 'P2025',
        clientVersion: '5.0.0',
      }),
    );
    orderClientproxy.emit.mockReturnValue(of(true));
    await expect(service.PaymentFail(resultPay)).rejects.toThrow(
      'Register not found',
    );
  });

  it('PaymentSucess: sucess', async () => {
    prismaMock.payment.update.mockResolvedValue(update);
    orderClientproxy.emit.mockReturnValue(of(true));
    await service.PaymentSucess(resultPay);
    expect(prismaMock.payment.update).toHaveBeenCalledWith({
      where: { id: resultPay.idPayment },
      data: {
        status: 'APPROVED',
      },
    });
  });

  it('PaymentSucess: fail', async () => {
    prismaMock.payment.update.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Error Prisma', {
        code: 'P2025',
        clientVersion: '5.0.0',
      }),
    );
    orderClientproxy.emit.mockReturnValue(of(true));
    await expect(service.PaymentSucess(resultPay)).rejects.toThrow(
      'Register not found',
    );
  });
});
