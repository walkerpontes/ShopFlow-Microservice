import { PrismaPg } from '@prisma/adapter-pg';
import {
  PrismaClient,
  PaymentMethod,
  Status,
} from '../src/generated/prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});
async function main() {
  await prisma.payment.createMany({
    data: [
      {
        orderId: 1,
        valor: 449.8,
        metodo: PaymentMethod.PIX,
        status: Status.APPROVED,
      },
      {
        orderId: 2,
        valor: 199.9,
        metodo: PaymentMethod.CREDIT_CARD,
        status: Status.APPROVED,
      },
      {
        orderId: 3,
        valor: 899.9,
        metodo: PaymentMethod.DEBIT_CARD,
        status: Status.PEDING,
      },
      {
        orderId: 4,
        valor: 549.9,
        metodo: PaymentMethod.PIX,
        status: Status.REJECTED,
      },
      {
        orderId: 5,
        valor: 659.8,
        metodo: PaymentMethod.CREDIT_CARD,
        status: Status.APPROVED,
      },
      {
        orderId: 6,
        valor: 179.9,
        metodo: PaymentMethod.DEBIT_CARD,
        status: Status.APPROVED,
      },
      {
        orderId: 7,
        valor: 4299.9,
        metodo: PaymentMethod.PIX,
        status: Status.APPROVED,
      },
      {
        orderId: 8,
        valor: 1199.9,
        metodo: PaymentMethod.CREDIT_CARD,
        status: Status.PEDING,
      },
      {
        orderId: 9,
        valor: 229.8,
        metodo: PaymentMethod.DEBIT_CARD,
        status: Status.APPROVED,
      },
      {
        orderId: 10,
        valor: 629.8,
        metodo: PaymentMethod.PIX,
        status: Status.APPROVED,
      },
    ],
  });

  console.log('✅ Seed de pagamentos executado com sucesso!');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
