import { Module } from '@nestjs/common';
import { MsProductController } from './ms-product.controller';
import { MsProductService } from './ms-product.service';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/ms-products/.env',
    }),
  ],
  controllers: [MsProductController],
  providers: [MsProductService, PrismaService],
})
export class MsProductModule {}
