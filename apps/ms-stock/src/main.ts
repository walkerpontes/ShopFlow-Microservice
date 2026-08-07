import { NestFactory } from '@nestjs/core';
import { MsStockModule } from './ms-stock.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const appTcp = await NestFactory.createMicroservice(MsStockModule, {
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3005,
    },
  });

  await appTcp.listen();

  const appRmq = await NestFactory.createMicroservice(MsStockModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'stock_queue',
      queueOptions: {
        durable: true,
      },
    },
  });
  await appRmq.listen();
}
bootstrap();
