import 'dotenv/config';

import { Module } from '@nestjs/common';
import { MsGatewayController } from './ms-gateway.controller';
import { MsGatewayService } from './ms-gateway.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/ms-gateway/.env',
    }),

    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3001,
        },
      },
      {
        name: 'ORDER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3002,
        },
      },
      {
        name: 'PRODUCT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3003,
        },
      },
      {
        name: 'PAYMENT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'payment_queue',
          queueOptions: {
            durable: true,
            arguments: {
              'x-dead-letter-exchange': 'err.dlx',
              'x-dead-letter-routing-key': 'err.key.dlq',
              'x-message-ttl': 60000,
            },
          },
        },
      },
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
          queueOptions: {
            durable: true,
            arguments: {
              'x-dead-letter-exchange': 'err.dlx',
              'x-dead-letter-routing-key': 'err.key.dlq',
              'x-message-ttl': 60000,
            },
          },
        },
      },
    ]),

    JwtModule.register({
      global: true,
      secret: process.env['TOKEN_JWT'],
      signOptions: { expiresIn: '5m' },
    }),
  ],
  controllers: [MsGatewayController],
  providers: [MsGatewayService],
})
export class MsGatewayModule {}
