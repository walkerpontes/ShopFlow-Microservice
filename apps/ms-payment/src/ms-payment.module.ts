import { Module } from '@nestjs/common';
import { MsPaymentController } from './ms-payment.controller';
import { MsPaymentService } from './ms-payment.service';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/ms-payment/.env',
    }),
    ClientsModule.register([
      {
        name: 'STOCK_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3005,
        },
      },
      {
        name: 'ORDER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'order_queue',
        },
      },
    ]),
  ],
  controllers: [MsPaymentController],
  providers: [MsPaymentService, PrismaService],
})
export class MsPaymentModule {}
