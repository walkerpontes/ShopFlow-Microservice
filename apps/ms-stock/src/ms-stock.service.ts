import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { OrderItemsDto } from '@/lib/dto/OrderDto';
import { ChangeStock, Items } from '@/lib/dto/StockDto';
import { ErroPrisma } from '@/lib/error/ErrorPrisma';

@Injectable()
export class MsStockService {
  constructor(private readonly prisma: PrismaService) {}

  async VerifyStock(items: OrderItemsDto[]) {
    try {
      for (const item of items) {
        const result = await this.prisma.stock.findUniqueOrThrow({
          where: { productId: item.produtoId },
        });

        if (item.quantidade > result.quantidade) {
          return {
            sucess: false,
            itemFailed: item,
            description: `${item.nomeProduto} Insufficient stock`,
          };
        }
      }

      return { sucess: true };
    } catch (error) {
      new ErroPrisma(error);
    }
  }

  async StockReduction(items: Items[]) {
    try {
      for (const item of items) {
        await this.prisma.stock.update({
          where: { productId: item.produtoId },
          data: { quantidade: { decrement: item.quantidade } },
        });
        await this.prisma.stockMovement.create({
          data: {
            productId: item.produtoId,
            quantidade: item.quantidade,
            type: 'EXIT',
          },
        });
      }
    } catch (error) {
      new ErroPrisma(error);
    }
  }

  async Create(stock: ChangeStock) {
    try {
      await this.prisma.$transaction([
        this.prisma.stock.create({
          data: {
            productId: stock.productId,
            quantidade: stock.quantidade,
          },
        }),
        this.prisma.stockMovement.create({
          data: {
            productId: stock.productId,
            quantidade: stock.quantidade,
            type: 'ENTRY',
          },
        }),
      ]);
    } catch (error) {
      new ErroPrisma(error);
    }
  }

  async ChangeQuant(change: ChangeStock) {
    try {
      const verifyProd = await this.prisma.stock.update({
        where: { productId: change.productId },
        data: {
          quantidade: { increment: change.quantidade },
        },
      });

      await this.prisma.stockMovement.create({
        data: {
          productId: change.productId,
          quantidade: change.quantidade,
          type: 'ADJUSTMENT',
        },
      });
      return verifyProd;
    } catch (error) {
      new ErroPrisma(error);
    }
  }
}
