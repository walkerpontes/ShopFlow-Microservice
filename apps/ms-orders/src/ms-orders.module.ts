import { Module } from '@nestjs/common';
import { MsOrdersController } from './ms-orders.controller';
import { MsOrdersService } from './ms-orders.service';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/ms-orders/.env',
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
        name: 'STOCK_SERVICE_RMQ',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'stock_queue',
        },
      },
      {
        name: 'PAYMENT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3006,
        },
      },
    ]),
  ],
  controllers: [MsOrdersController],
  providers: [MsOrdersService, PrismaService],
})
export class MsOrdersModule {}
