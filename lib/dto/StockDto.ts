import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export interface Verify {
  sucess: boolean;
  itemFailed?: object;
  description?: string;
}

export interface Items {
  id: number;
  quantidade: number;
  orderId: number;
  produtoId: number;
  nomeProduto: string;
  preco: number;
}
export interface StockDto {
  id: number;
  productId: number;
  quantidade: number;
  updatedAt: Date;
}

export class ChangeStock {
  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsNotEmpty()
  productId!: number;
  @ApiProperty({ example: 99 })
  @IsNumber()
  @IsNotEmpty()
  quantidade!: number;
}
