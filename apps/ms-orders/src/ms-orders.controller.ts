import { Controller } from '@nestjs/common';
import { MsOrdersService } from './ms-orders.service';
import { EventPattern, MessagePattern, Transport } from '@nestjs/microservices';
import type { CreateOrderDto } from '@/lib/dto/OrderDto';
import type { ResultPay } from '@/lib/dto/PaymentDto';

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
  async OrderSucess(result: ResultPay) {
    await this.msOrdersService.OrderSucess(result);
  }
  @EventPattern('order_fail', Transport.RMQ)
  async OrderFail(result: ResultPay) {
    await this.msOrdersService.OrderFail(result);
  }
}
