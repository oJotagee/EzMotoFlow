-- CreateEnum
CREATE TYPE "TipoCliente" AS ENUM ('PESSOA_FISICA', 'PESSOA_JURIDICA');

-- CreateTable
CREATE TABLE "Clients" (
    "id" TEXT NOT NULL,
    "tipo" "TipoCliente" NOT NULL,
    "fullName" TEXT NOT NULL,
    "documento" TEXT NOT NULL,
    "telefone" TEXT,
    "email" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3),
    "companyName" TEXT,
    "cep" TEXT NOT NULL,
    "rua" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "complementos" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ativo',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Clients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Clients_documento_key" ON "Clients"("documento");

-- CreateIndex
CREATE UNIQUE INDEX "Clients_email_key" ON "Clients"("email");
