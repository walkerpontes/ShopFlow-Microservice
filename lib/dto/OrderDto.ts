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
import { ApiProperty } from '@nestjs/swagger';

export class OrderItemsDto {
  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsNotEmpty()
  produtoId!: number;
  @ApiProperty({ example: 'Product name' })
  @IsString()
  @IsNotEmpty()
  nomeProduto!: string;
  @ApiProperty({ example: 99.99 })
  @IsNumber()
  @IsNotEmpty()
  preco!: number;
  @ApiProperty({ example: 10 })
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
  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsNotEmpty()
  userId!: number;
  @ApiProperty({ type: OrderItemsDto })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemsDto)
  items!: OrderItemsDto[];
  @ApiProperty({ enum: MethodPayment, example: MethodPayment.PIX })
  @IsEnum(MethodPayment, { message: 'PIX, DEBIT_CARD or CREDIT_CARD' })
  method!: MethodPayment;
}
