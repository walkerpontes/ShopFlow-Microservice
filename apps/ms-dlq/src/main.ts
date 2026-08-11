import { NestFactory } from '@nestjs/core';
import { MsDlqModule } from './ms-dlq.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(MsDlqModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'err_dlq',
      wildcards: true,
    },
  });

  await app.listen();
}
bootstrap();
