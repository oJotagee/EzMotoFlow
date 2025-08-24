/*
  Warnings:

  - The `status` column on the `Clients` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `MotorCycle` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ativo', 'inativo');

-- CreateEnum
CREATE TYPE "StatusContrato" AS ENUM ('ativo', 'cancelado', 'finalizado');

-- AlterTable
ALTER TABLE "Clients" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ativo';

-- AlterTable
ALTER TABLE "MotorCycle" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ativo';

-- CreateTable
CREATE TABLE "Contracts" (
    "id" TEXT NOT NULL,
    "valor" INTEGER NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "status" "StatusContrato" NOT NULL DEFAULT 'ativo',
    "observacao" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "motorcycleId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "Contracts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contracts_motorcycleId_key" ON "Contracts"("motorcycleId");

-- AddForeignKey
ALTER TABLE "Contracts" ADD CONSTRAINT "Contracts_motorcycleId_fkey" FOREIGN KEY ("motorcycleId") REFERENCES "MotorCycle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contracts" ADD CONSTRAINT "Contracts_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;
