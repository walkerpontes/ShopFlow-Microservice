import { NestFactory } from '@nestjs/core';
import { MsOrdersModule } from './ms-orders.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const appTcp = await NestFactory.createMicroservice(MsOrdersModule, {
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3002,
    },
  });
  await appTcp.listen();

  const appRmq = await NestFactory.createMicroservice(MsOrdersModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'order_queue',
      queueOptions: {
        durable: true,
      },
    },
  });
  await appRmq.listen();

  console.log('Orders TCP + RabbitMQ iniciado');
}
bootstrap();
