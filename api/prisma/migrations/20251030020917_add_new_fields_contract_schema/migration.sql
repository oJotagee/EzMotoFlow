-- AlterTable
ALTER TABLE "Contracts" ADD COLUMN     "signatureToken" TEXT,
ADD COLUMN     "signatureTokenExpiry" TIMESTAMP(3);
