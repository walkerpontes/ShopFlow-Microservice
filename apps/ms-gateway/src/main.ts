import { NestFactory } from '@nestjs/core';
import { MsGatewayModule } from './ms-gateway.module';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(MsGatewayModule);
  console.log('antes');
  const pipe = new ValidationPipe();
  console.log('depois');
  app.useGlobalPipes(pipe);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
