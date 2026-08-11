import { Controller } from '@nestjs/common';
import { MsStockService } from './ms-stock.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  RmqContext,
  RpcException,
  Transport,
} from '@nestjs/microservices';
import { OrderItemsDto } from '@/lib/dto/OrderDto';
import type { ChangeStock, Items } from '@/lib/dto/StockDto';
import { Channel, Message } from 'amqplib';

@Controller()
export class MsStockController {
  constructor(private readonly msStockService: MsStockService) {}

  @MessagePattern('order_stock', Transport.TCP)
  async VerifyStock(items: OrderItemsDto[]) {
    return await this.msStockService.VerifyStock(items);
  }

  @MessagePattern('stock_quant', Transport.TCP)
  async ChangeQuant(change: ChangeStock) {
    return await this.msStockService.ChangeQuant(change);
  }

  @EventPattern('stock_sucess', Transport.RMQ)
  async StockReduction(items: Items[]) {
    await this.msStockService.StockReduction(items);
  }

  @EventPattern('stock_create', Transport.RMQ)
  async Create(stock: ChangeStock) {
    await this.msStockService.Create(stock);
  }

  @EventPattern('stock_rmq')
  TestDlq(data: string, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef() as Channel;
    const message = ctx.getMessage() as Message;
    try {
      throw new RpcException('algo');
      channel.ack(message);
    } catch {
      channel.nack(message, false, false);
    }
  }
}
