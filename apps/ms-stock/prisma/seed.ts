import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, MovementType } from '../src/generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  await prisma.stock.createMany({
    data: [
      { productId: 1, quantidade: 50 },
      { productId: 2, quantidade: 35 },
      { productId: 3, quantidade: 20 },
      { productId: 4, quantidade: 12 },
      { productId: 5, quantidade: 18 },
      { productId: 6, quantidade: 40 },
      { productId: 7, quantidade: 25 },
      { productId: 8, quantidade: 8 },
      { productId: 9, quantidade: 15 },
      { productId: 10, quantidade: 60 },
    ],
  });

  await prisma.stockMovement.createMany({
    data: [
      {
        productId: 1,
        quantidade: 50,
        type: MovementType.ENTRY,
      },
      {
        productId: 2,
        quantidade: 35,
        type: MovementType.ENTRY,
      },
      {
        productId: 3,
        quantidade: 20,
        type: MovementType.ENTRY,
      },
      {
        productId: 4,
        quantidade: 12,
        type: MovementType.ENTRY,
      },
      {
        productId: 5,
        quantidade: 18,
        type: MovementType.ENTRY,
      },
      {
        productId: 6,
        quantidade: 40,
        type: MovementType.ENTRY,
      },
      {
        productId: 7,
        quantidade: 25,
        type: MovementType.ENTRY,
      },
      {
        productId: 8,
        quantidade: 8,
        type: MovementType.ENTRY,
      },
      {
        productId: 9,
        quantidade: 15,
        type: MovementType.ENTRY,
      },
      {
        productId: 10,
        quantidade: 60,
        type: MovementType.ENTRY,
      },
    ],
  });

  console.log('✅ Seed de estoque executado com sucesso!');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
