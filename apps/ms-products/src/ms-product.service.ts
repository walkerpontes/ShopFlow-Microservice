import {
  ChangeStatus,
  ProductDto,
  ProductPatchDefaultDto,
} from '@/lib/dto/ProductDto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { RpcException } from '@nestjs/microservices';
import { ErroPrisma } from '@/lib/error/ErrorPrisma';

@Injectable()
export class MsProductService {
  constructor(private readonly prisma: PrismaService) {}
  async Change(change: ChangeStatus) {
    try {
      const result = await this.prisma.product.update({
        where: { id: change.id },
        data: { ativo: change.ativo },
      });
      return result;
    } catch (error) {
      new ErroPrisma(error);
    }
  }
  async Delete(id: number) {
    try {
      const result = await this.prisma.product.delete({ where: { id: id } });

      return result;
    } catch (error) {
      new ErroPrisma(error);
    }
  }
  async Create(product: ProductDto) {
    try {
      const result = await this.prisma.product.create({
        data: {
          nome: product.nome,
          descricao: product.descricao,
          preco: product.preco,
          ativo: true,
        },
      });

      if (!result) {
        throw new RpcException({
          message: 'No products was found',
          status: 404,
        });
      }
      return result;
    } catch (error) {
      new ErroPrisma(error);
    }
  }
  async FindId(id: number) {
    try {
      const result = await this.prisma.product.findUniqueOrThrow({
        where: { id: id },
      });

      return result;
    } catch (error) {
      new ErroPrisma(error);
    }
  }
  async All() {
    try {
      const result = await this.prisma.product.findMany();
      if (result.length === 0) {
        throw new RpcException({
          message: 'No products was found',
          status: 404,
        });
      }
      return result;
    } catch (error) {
      new ErroPrisma(error);
    }
  }

  async Patch(prod: ProductPatchDefaultDto) {
    try {
      const result = await this.prisma.product.update({
        where: { id: prod.id },
        data: prod.product,
      });
      return result;
    } catch (error) {
      new ErroPrisma(error);
    }
  }
}
