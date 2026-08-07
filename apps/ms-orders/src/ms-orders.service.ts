import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateOrderDto } from '@/lib/dto/OrderDto';
import { Status } from './generated/prisma';
import { firstValueFrom } from 'rxjs';
import { Verify } from '@/lib/dto/StockDto';
import { ResultPay, ResultPaymentDto } from '@/lib/dto/PaymentDto';
import { ErroPrisma } from '@/lib/error/ErrorPrisma';

@Injectable()
export class MsOrdersService {
  constructor(
    @Inject('STOCK_SERVICE') private readonly stockClient: ClientProxy,
    @Inject('STOCK_SERVICE_RMQ') private readonly stockRmqClient: ClientProxy,
    @Inject('PAYMENT_SERVICE') private readonly paymentClient: ClientProxy,
    private readonly prisma: PrismaService,
  ) {}

  async findAllOrder() {
    try {
      const result = await this.prisma.order.findMany({
        include: { items: true },
      });

      if (result.length === 0)
        throw new RpcException({ message: 'No order was found.', status: 404 });

      return result;
    } catch (error) {
      new ErroPrisma(error);
    }
  }

  async findOrderId(id: number) {
    try {
      const result = await this.prisma.order.findUniqueOrThrow({
        where: { id: id },
        include: { items: true },
      });

      return result;
    } catch (error) {
      new ErroPrisma(error);
    }
  }

  async createOrder(order: CreateOrderDto) {
    try {
      const total = order.items.reduce(
        (acc, item) => acc + item.preco * item.quantidade,
        0,
      );

      // Verifica no estoque

      const resultStock = await firstValueFrom(
        this.stockClient.send<Verify>('order_stock', order.items),
      );

      // Cria order de acordo com o resultado do stock

      const create = await this.prisma.order.create({
        data: {
          userId: order.userId,
          status: resultStock.sucess ? Status.PEDING : Status.CANCELED,
          total,
          items: {
            create: order.items,
          },
        },
        include: { items: true },
      });

      // Se tiver estoque, cria um pagamento

      if (resultStock.sucess) {
        const resultPay = await firstValueFrom(
          this.paymentClient.send<ResultPaymentDto>('payment_create', {
            orderId: create.id,
            valor: create.total,
            method: order.method,
          }),
        );

        return { ...create, payment: resultPay };
      }

      // Se tiver não estoque, retorna o pedido e o resultado do estoque

      return { ...create, ...resultStock };
    } catch (error) {
      new ErroPrisma(error);
    }
  }

  async OrderFail(result: ResultPay) {
    try {
      await this.prisma.order.update({
        where: { id: result.idOrder },
        data: { status: 'CANCELED' },
      });
    } catch (error) {
      new ErroPrisma(error);
    }
  }
  async OrderSucess(result: ResultPay) {
    try {
      const order = await this.prisma.order.update({
        where: { id: result.idOrder },
        data: { status: 'PAID' },
        include: { items: true },
      });

      await firstValueFrom(
        this.stockRmqClient.emit('stock_sucess', order.items),
      );
    } catch (error) {
      new ErroPrisma(error);
    }
  }
}
