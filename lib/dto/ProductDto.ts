import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ProductDto {
  @IsString()
  @IsNotEmpty()
  nome!: string;
  @IsString()
  @IsNotEmpty()
  descricao!: string;
  @IsNumber()
  @IsNotEmpty()
  preco!: number;
  @IsNumber()
  @IsNotEmpty()
  quantidade!: number;
}

export class ProductPatchDto {
  @IsString()
  @IsOptional()
  nome?: string;
  @IsString()
  @IsOptional()
  descricao?: string;
  @IsNumber()
  @IsOptional()
  preco?: number;
  @IsNumber()
  @IsOptional()
  quantidade?: number;
}

export class ProductPatchDefaultDto {
  id!: number;
  product!: ProductPatchDto;
}

export class ChangeStatus {
  @IsNumber()
  @IsNotEmpty()
  id!: number;
  @IsBoolean()
  @IsNotEmpty()
  ativo!: boolean;
}

export interface ResultProduct {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}
