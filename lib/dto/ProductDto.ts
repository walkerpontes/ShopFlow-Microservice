import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ProductDto {
  @ApiProperty({ example: 'Product name' })
  @IsString()
  @IsNotEmpty()
  nome!: string;
  @ApiProperty({ example: 'Product description' })
  @IsString()
  @IsNotEmpty()
  descricao!: string;
  @ApiProperty({ example: 99.99 })
  @IsNumber()
  @IsNotEmpty()
  preco!: number;
  @ApiProperty({ example: 99 })
  @IsNumber()
  @IsNotEmpty()
  quantidade!: number;
}

export class ProductPatchDto {
  @ApiProperty({ example: 'Product name' })
  @IsString()
  @IsOptional()
  nome?: string;
  @ApiProperty({ example: 'Product description' })
  @IsString()
  @IsOptional()
  descricao?: string;
  @ApiProperty({ example: 99.99 })
  @IsNumber()
  @IsOptional()
  preco?: number;
  @ApiProperty({ example: 99 })
  @IsNumber()
  @IsOptional()
  quantidade?: number;
}

export class ProductPatchDefaultDto {
  id!: number;
  product!: ProductPatchDto;
}

export class ChangeStatus {
  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsNotEmpty()
  id!: number;
  @ApiProperty({ example: true })
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
