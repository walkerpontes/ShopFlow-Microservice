import { Controller } from '@nestjs/common';
import { MsPaymentService } from './ms-payment.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  RmqContext,
  Transport,
} from '@nestjs/microservices';
import type { CreatePaymentDefaultDto, ResultPay } from '@/lib/dto/PaymentDto';
import { Channel, Message } from 'amqplib';

@Controller()
export class MsPaymentController {
  constructor(private readonly msPaymentService: MsPaymentService) {}

  @MessagePattern('payment_create')
  async createPayment(payment: CreatePaymentDefaultDto) {
    return await this.msPaymentService.CreatePayment(payment);
  }

  @EventPattern('pay_sucess', Transport.RMQ)
  async paymentSucess(result: ResultPay, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef() as Channel;
    const message = ctx.getMessage() as Message;
    try {
      await this.msPaymentService.PaymentSucess(result);
      channel.ack(message);
    } catch {
      channel.nack(message, false, false);
    }
  }
  @EventPattern('pay_fail', Transport.RMQ)
  async paymentFail(result: ResultPay, @Ctx() ctx: RmqContext) {
    const channel = ctx.getChannelRef() as Channel;
    const message = ctx.getMessage() as Message;
    try {
      await this.msPaymentService.PaymentFail(result);
      channel.ack(message);
    } catch {
      channel.nack(message, false, false);
    }
  }
}
