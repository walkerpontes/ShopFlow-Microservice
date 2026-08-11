import { Module } from '@nestjs/common';
import { MsDlqController } from './ms-dlq.controller';
import { MsDlqService } from './ms-dlq.service';

@Module({
  imports: [],
  controllers: [MsDlqController],
  providers: [MsDlqService],
})
export class MsDlqModule {}
