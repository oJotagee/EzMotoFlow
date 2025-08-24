/*
  Warnings:

  - The `status` column on the `Clients` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `MotorCycle` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "StatusMotorcycle" AS ENUM ('ativo', 'inativo', 'vendido');

-- CreateEnum
CREATE TYPE "StatusClient" AS ENUM ('ativo', 'inativo');

-- AlterTable
ALTER TABLE "Clients" DROP COLUMN "status",
ADD COLUMN     "status" "StatusClient" NOT NULL DEFAULT 'ativo';

-- AlterTable
ALTER TABLE "MotorCycle" DROP COLUMN "status",
ADD COLUMN     "status" "StatusMotorcycle" NOT NULL DEFAULT 'ativo';

-- DropEnum
DROP TYPE "Status";
