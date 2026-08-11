import { Controller } from '@nestjs/common';
import { MsDlqService } from './ms-dlq.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class MsDlqController {
  constructor(private readonly msDlqService: MsDlqService) {}

  @EventPattern('#')
  ConsumerDlq(@Payload() data: any) {
    console.log('--- NOVA MENSAGEM NA DLQ ---');
    console.log('Dados recebidos:', data);
  }
}
