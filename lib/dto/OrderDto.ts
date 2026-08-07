import { Status } from '@/apps/ms-orders/src/generated/prisma';
import { MethodPayment, ResultPaymentDto } from './PaymentDto';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemsDto {
  @IsNumber()
  @IsNotEmpty()
  produtoId!: number;
  @IsString()
  @IsNotEmpty()
  nomeProduto!: string;
  @IsNumber()
  @IsNotEmpty()
  preco!: number;
  @IsNumber()
  @IsNotEmpty()
  quantidade!: number;
}

export interface OrderDto {
  userId: number;
  status: Status;
  total: number;
  items: OrderItemsDto[];
}

export interface OrderProcessDto {
  userId: number;
  status: Status;
  total: number;
  items: OrderItemsDto[];
  payment: ResultPaymentDto;
}

export interface OrderFailedDto {
  userId: number;
  status: Status;
  total: number;
  items: OrderItemsDto[];
  itemFailed: OrderItemsDto;
  description?: string;
}

export class CreateOrderDto {
  @IsNumber()
  @IsNotEmpty()
  userId!: number;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemsDto)
  items!: OrderItemsDto[];
  @IsEnum(MethodPayment, { message: 'PIX, DEBIT_CARD or CREDIT_CARD' })
  method!: MethodPayment;
}
