/*
  Warnings:

  - Added the required column `pagamento` to the `Contracts` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Pagamento" AS ENUM ('boleto', 'cartao', 'pix');

-- AlterTable
ALTER TABLE "Contracts" ADD COLUMN     "contractoPdf" TEXT,
ADD COLUMN     "pagamento" "Pagamento" NOT NULL;
