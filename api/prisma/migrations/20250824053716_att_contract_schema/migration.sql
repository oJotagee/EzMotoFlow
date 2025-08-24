/*
  Warnings:

  - You are about to drop the column `dataFim` on the `Contracts` table. All the data in the column will be lost.
  - You are about to drop the column `dataInicio` on the `Contracts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Contracts" DROP COLUMN "dataFim",
DROP COLUMN "dataInicio",
ADD COLUMN     "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
