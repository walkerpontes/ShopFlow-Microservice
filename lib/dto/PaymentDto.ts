import { PaymentMethod } from '@/apps/ms-payment/src/generated/prisma';
import { IsNotEmpty, IsNumber } from 'class-validator';

export enum MethodPayment {
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
  method: MethodPayment;
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
  method: MethodPayment;
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
  @IsNumber()
  @IsNotEmpty()
  idPayment!: number;
  @IsNumber()
  @IsNotEmpty()
  idOrder!: number;
}
