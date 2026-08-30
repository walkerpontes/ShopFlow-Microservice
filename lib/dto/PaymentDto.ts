import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export enum PaymentMethod {
  PIX = 'PIX',
  DEBIT_CARD = 'DEBIT_CARD',
  CREDIT_CARD = 'CREDIT_CARD',
}

export enum StatusPayment {
  PEDING,
  APPROVED,
  REJECTED,
}

export interface CreatePaymentDto {
  orderId: number;
  valor: number;
  method: PaymentMethod;
}

export interface CreatePaymentDefaultDto {
  orderId: number;
  valor: number;
  method: PaymentMethod;
}

export interface ResultPaymentDto {
  id: number;
  status: StatusPayment;
  createdAt: Date;
  orderId: number;
  valor: number;
  method: PaymentMethod;
  data: PixPaymentDto | CardPaymentDto;
}

export interface PixPaymentDto {
  pixCode: string;
  qrCode: string;
}
export interface CardPaymentDto {
  tokenCard: string;
}

export class ResultPay {
  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsNotEmpty()
  idPayment!: number;
  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsNotEmpty()
  idOrder!: number;
}
