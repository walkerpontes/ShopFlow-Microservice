import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Role } from '../src/generated/prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  const passwordHash = await argon2.hash('123456');

  const users = [
    {
      nome: 'Admin',
      email: 'admin@admin.com',
      role: Role.ADMIN,
    },
    {
      nome: 'João',
      email: 'joao@email.com',
      role: Role.USER,
    },
    {
      nome: 'Maria',
      email: 'maria@email.com',
      role: Role.USER,
    },
    {
      nome: 'Pedro',
      email: 'pedro@email.com',
      role: Role.USER,
    },
    {
      nome: 'Ana',
      email: 'ana@email.com',
      role: Role.USER,
    },
    {
      nome: 'Carlos',
      email: 'carlos@email.com',
      role: Role.USER,
    },
    {
      nome: 'Juliana',
      email: 'juliana@email.com',
      role: Role.USER,
    },
    {
      nome: 'Lucas',
      email: 'lucas@email.com',
      role: Role.USER,
    },
    {
      nome: 'Fernanda',
      email: 'fernanda@email.com',
      role: Role.USER,
    },
    {
      nome: 'Rafael',
      email: 'rafael@email.com',
      role: Role.USER,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: {
        email: user.email,
      },
      update: {
        nome: user.nome,
        role: user.role,
      },
      create: {
        nome: user.nome,
        email: user.email,
        pass: passwordHash,
        role: user.role,
      },
    });
  }

  console.log('✅ Seed executado com sucesso!');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
