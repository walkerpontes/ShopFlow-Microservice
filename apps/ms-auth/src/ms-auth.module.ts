import 'dotenv/config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MsAuthService } from './ms-auth.service';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { MsAuthController } from './ms-auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/ms-auth/.env',
    }),
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: process.env['TOKEN_JWT'],
      signOptions: { expiresIn: '5m' },
    }),
  ],
  controllers: [MsAuthController],
  providers: [MsAuthService, PrismaService],
})
export class MsAuthModule {}
