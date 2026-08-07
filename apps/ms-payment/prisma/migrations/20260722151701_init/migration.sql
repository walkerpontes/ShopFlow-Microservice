/*
  Warnings:

  - You are about to alter the column `valor` on the `Payment` table. The data in that column could be lost. The data in that column will be cast from `Money` to `Decimal(12,2)`.

*/
-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "valor" SET DATA TYPE DECIMAL(12,2);
