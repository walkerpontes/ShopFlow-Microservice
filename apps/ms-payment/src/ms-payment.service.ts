import {
  CardPaymentDto,
  CreatePaymentDefaultDto,
  PixPaymentDto,
  ResultPay,
} from '@/lib/dto/PaymentDto';
import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PaymentMethod, Status } from './generated/prisma';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ErroPrisma } from '@/lib/error/ErrorPrisma';

@Injectable()
export class MsPaymentService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('ORDER_SERVICE') private readonly orderClient: ClientProxy,
  ) {}

  async CreatePayment(payment: CreatePaymentDefaultDto) {
    try {
      const create = await this.prisma.payment.create({
        data: {
          orderId: payment.orderId,
          valor: payment.valor,
          status: Status.PEDING,
          metodo: payment.method,
        },
      });
      if (!create)
        throw new RpcException({ message: 'Create payment fail', status: 500 });
      const data = this.ProcessPayment(create.metodo);
      return { ...create, ...data };
    } catch (error) {
      new ErroPrisma(error);
    }
  }

  ProcessPayment(method: PaymentMethod): PixPaymentDto | CardPaymentDto {
    if (method == PaymentMethod.PIX) {
      return { pixCode: 'pixcodetest', qrCode: 'qrcodetest' };
    }
    if (method == PaymentMethod.CREDIT_CARD) {
      return { tokenCard: 'tokencredittest' };
    }
    if (method == PaymentMethod.DEBIT_CARD) {
      return { tokenCard: 'tokendebittest' };
    }

    return { pixCode: 'pixcodetest', qrCode: 'qrcodetest' };
  }

  async PaymentFail(result: ResultPay) {
    try {
      await this.prisma.payment.update({
        where: { id: result.idPayment },
        data: {
          status: 'REJECTED',
        },
      });

      await firstValueFrom(this.orderClient.emit('order_fail', result));
    } catch (error) {
      new ErroPrisma(error);
    }
  }
  async PaymentSucess(result: ResultPay) {
    try {
      await this.prisma.payment.update({
        where: { id: result.idPayment },
        data: {
          status: 'APPROVED',
        },
      });

      await firstValueFrom(this.orderClient.emit('order_sucess', result));
    } catch (error) {
      new ErroPrisma(error);
    }
  }
}
