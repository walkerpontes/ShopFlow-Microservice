import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});
async function main() {
  await prisma.product.createMany({
    data: [
      {
        nome: 'Mouse Gamer RGB',
        descricao: 'Mouse óptico com 7200 DPI e iluminação RGB.',
        preco: 149.9,
      },
      {
        nome: 'Teclado Mecânico',
        descricao: 'Teclado mecânico com switches azuis.',
        preco: 299.9,
      },
      {
        nome: 'Headset Gamer',
        descricao: 'Headset com microfone e som surround.',
        preco: 199.9,
      },
      {
        nome: 'Monitor 24"',
        descricao: 'Monitor Full HD IPS de 24 polegadas.',
        preco: 899.9,
      },
      {
        nome: 'SSD 1TB',
        descricao: 'SSD NVMe de alta velocidade.',
        preco: 549.9,
      },
      {
        nome: 'Memória RAM 16GB',
        descricao: 'Memória DDR4 3200MHz.',
        preco: 329.9,
      },
      {
        nome: 'Webcam Full HD',
        descricao: 'Webcam 1080p com microfone embutido.',
        preco: 179.9,
      },
      {
        nome: 'Notebook',
        descricao: 'Notebook com Intel Core i5, 16GB RAM e SSD 512GB.',
        preco: 4299.9,
      },
      {
        nome: 'Cadeira Gamer',
        descricao: 'Cadeira ergonômica com ajuste de altura.',
        preco: 1199.9,
      },
      {
        nome: 'Mouse Pad XXL',
        descricao: 'Mouse pad grande com base antiderrapante.',
        preco: 79.9,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Produtos cadastrados!');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
