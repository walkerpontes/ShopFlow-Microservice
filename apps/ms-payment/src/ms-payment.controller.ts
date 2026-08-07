import { Controller } from '@nestjs/common';
import { MsPaymentService } from './ms-payment.service';
import { EventPattern, MessagePattern, Transport } from '@nestjs/microservices';
import type { CreatePaymentDefaultDto, ResultPay } from '@/lib/dto/PaymentDto';

@Controller()
export class MsPaymentController {
  constructor(private readonly msPaymentService: MsPaymentService) {}

  @MessagePattern('payment_create')
  async createPayment(payment: CreatePaymentDefaultDto) {
    return await this.msPaymentService.CreatePayment(payment);
  }

  @EventPattern('pay_sucess', Transport.RMQ)
  async paymentSucess(result: ResultPay) {
    await this.msPaymentService.PaymentSucess(result);
  }
  @EventPattern('pay_fail', Transport.RMQ)
  async paymentFail(result: ResultPay) {
    await this.msPaymentService.PaymentFail(result);
  }
}
