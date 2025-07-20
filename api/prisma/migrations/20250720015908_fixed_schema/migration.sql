/*
  Warnings:

  - Changed the type of `ano` on the `MotorCycle` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "MotorCycle" DROP COLUMN "ano",
ADD COLUMN     "ano" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "observacao" DROP NOT NULL,
ALTER COLUMN "observacao" SET DATA TYPE TEXT;
