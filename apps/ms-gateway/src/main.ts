import { NestFactory } from '@nestjs/core';
import { MsGatewayModule } from './ms-gateway.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(MsGatewayModule);

  const config = new DocumentBuilder()
    .setTitle('ShopFlow - Microservice')
    .setDescription(
      'Simula uma plataforma de pedidos/e-commerce baseada em microsserviços (gateway, orders, payment, stock, products, auth e RabbitMQ)',
    )
    .setVersion('1.0')
    .addTag('api')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'acess-token',
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
