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
  @IsNumber()
  @IsNotEmpty()
  productId!: number;
  @IsNumber()
  @IsNotEmpty()
  quantidade!: number;
}
