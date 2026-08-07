import { Module } from '@nestjs/common';
import { MsStockController } from './ms-stock.controller';
import { MsStockService } from './ms-stock.service';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/ms-stock/.env',
    }),
  ],
  controllers: [MsStockController],
  providers: [MsStockService, PrismaService],
})
export class MsStockModule {}
