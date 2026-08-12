import { Controller } from '@nestjs/common';
import { MsOrdersService } from './ms-orders.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  RmqContext,
  Transport,
} from '@nestjs/microservices';
import type { CreateOrderDto } from '@/lib/dto/OrderDto';
import type { ResultPay } from '@/lib/dto/PaymentDto';
import { Channel, Message } from 'amqplib';

@Controller()
export class MsOrdersController {
  constructor(private readonly msOrdersService: MsOrdersService) {}

  @MessagePattern('order_all', Transport.TCP)
  async FindAllOrder() {
    return await this.msOrdersService.findAllOrder();
  }

  @MessagePattern('order_id', Transport.TCP)
  async FindOrderId(id: number) {
    return await this.msOrdersService.findOrderId(id);
  }

  @MessagePattern('create_order', Transport.TCP)
  async CreateOrder(order: CreateOrderDto) {
    return await this.msOrdersService.createOrder(order);
  }

  @EventPattern('order_sucess', Transport.RMQ)
  async OrderSucess(result: ResultPay, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef() as Channel;
    const message = ctx.getMessage() as Message;
    try {
      await this.msOrdersService.OrderSucess(result);
      channel.ack(message);
    } catch {
      channel.nack(message, false, false);
    }
  }
  @EventPattern('order_fail', Transport.RMQ)
  async OrderFail(result: ResultPay, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef() as Channel;
    const message = ctx.getMessage() as Message;

    try {
      await this.msOrdersService.OrderFail(result);
      channel.ack(message);
    } catch {
      channel.nack(message, false, false);
    }
  }
}
