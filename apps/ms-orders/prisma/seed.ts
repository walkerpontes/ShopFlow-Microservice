import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Status } from '../src/generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});
async function main() {
  await prisma.order.create({
    data: {
      userId: 1,
      status: Status.PAID,
      total: 449.8,
      items: {
        create: [
          {
            produtoId: 1,
            nomeProduto: 'Mouse Gamer RGB',
            preco: 149.9,
            quantidade: 1,
          },
          {
            produtoId: 2,
            nomeProduto: 'Teclado Mecânico',
            preco: 299.9,
            quantidade: 1,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: 2,
      status: Status.DELIVERED,
      total: 199.9,
      items: {
        create: [
          {
            produtoId: 3,
            nomeProduto: 'Headset Gamer',
            preco: 199.9,
            quantidade: 1,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: 3,
      status: Status.PEDING,
      total: 899.9,
      items: {
        create: [
          {
            produtoId: 4,
            nomeProduto: 'Monitor 24"',
            preco: 899.9,
            quantidade: 1,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: 4,
      status: Status.CANCELED,
      total: 549.9,
      items: {
        create: [
          {
            produtoId: 5,
            nomeProduto: 'SSD 1TB',
            preco: 549.9,
            quantidade: 1,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: 5,
      status: Status.PAID,
      total: 659.8,
      items: {
        create: [
          {
            produtoId: 6,
            nomeProduto: 'Memória RAM 16GB',
            preco: 329.9,
            quantidade: 2,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: 6,
      status: Status.DELIVERED,
      total: 179.9,
      items: {
        create: [
          {
            produtoId: 7,
            nomeProduto: 'Webcam Full HD',
            preco: 179.9,
            quantidade: 1,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: 7,
      status: Status.PAID,
      total: 4299.9,
      items: {
        create: [
          {
            produtoId: 8,
            nomeProduto: 'Notebook',
            preco: 4299.9,
            quantidade: 1,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: 8,
      status: Status.PEDING,
      total: 1199.9,
      items: {
        create: [
          {
            produtoId: 9,
            nomeProduto: 'Cadeira Gamer',
            preco: 1199.9,
            quantidade: 1,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: 9,
      status: Status.PAID,
      total: 229.8,
      items: {
        create: [
          {
            produtoId: 1,
            nomeProduto: 'Mouse Gamer RGB',
            preco: 149.9,
            quantidade: 1,
          },
          {
            produtoId: 10,
            nomeProduto: 'Mouse Pad XXL',
            preco: 79.9,
            quantidade: 1,
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      userId: 10,
      status: Status.DELIVERED,
      total: 629.8,
      items: {
        create: [
          {
            produtoId: 5,
            nomeProduto: 'SSD 1TB',
            preco: 549.9,
            quantidade: 1,
          },
          {
            produtoId: 10,
            nomeProduto: 'Mouse Pad XXL',
            preco: 79.9,
            quantidade: 1,
          },
        ],
      },
    },
  });

  console.log('✅ Seed de pedidos executado com sucesso!');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
