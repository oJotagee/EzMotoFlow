-- CreateEnum
CREATE TYPE "StatusMotorcycle" AS ENUM ('ativo', 'inativo', 'vendido', 'andamento');

-- CreateEnum
CREATE TYPE "TipoCliente" AS ENUM ('PESSOA_FISICA', 'PESSOA_JURIDICA');

-- CreateEnum
CREATE TYPE "StatusClient" AS ENUM ('ativo', 'inativo');

-- CreateEnum
CREATE TYPE "Pagamento" AS ENUM ('boleto', 'cartao', 'pix');

-- CreateEnum
CREATE TYPE "StatusContrato" AS ENUM ('ativo', 'cancelado', 'finalizado');

-- CreateEnum
CREATE TYPE "PermissionAction" AS ENUM ('READ', 'CREATE', 'UPDATE', 'DELETE');

-- CreateEnum
CREATE TYPE "PermissionResource" AS ENUM ('USERS', 'CLIENTS', 'MOTORCYCLES', 'CONTRACTS');

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MotorCycle" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cor" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "ano" TIMESTAMP(3) NOT NULL,
    "chassi" TEXT NOT NULL,
    "renavam" TEXT NOT NULL,
    "km" TEXT NOT NULL,
    "valor_compra" INTEGER NOT NULL,
    "valor_venda" INTEGER NOT NULL,
    "valor_fipe" INTEGER NOT NULL,
    "observacao" TEXT,
    "foto1" TEXT,
    "foto2" TEXT,
    "foto3" TEXT,
    "status" "StatusMotorcycle" NOT NULL DEFAULT 'ativo',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MotorCycle_pkey" PRIMARY KEY ("id")
);

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
    "status" "StatusClient" NOT NULL DEFAULT 'ativo',
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contracts" (
    "id" TEXT NOT NULL,
    "valor" INTEGER NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "StatusContrato" NOT NULL DEFAULT 'ativo',
    "observacao" TEXT,
    "pagamento" "Pagamento" NOT NULL,
    "contractoPdf" TEXT,
    "signatures" JSONB,
    "signatureToken" TEXT,
    "signatureTokenExpiry" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "motorcycleId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "Contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPermission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "resource" "PermissionResource" NOT NULL,
    "action" "PermissionAction" NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserPermission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "MotorCycle_placa_key" ON "MotorCycle"("placa");

-- CreateIndex
CREATE UNIQUE INDEX "MotorCycle_chassi_key" ON "MotorCycle"("chassi");

-- CreateIndex
CREATE UNIQUE INDEX "MotorCycle_renavam_key" ON "MotorCycle"("renavam");

-- CreateIndex
CREATE UNIQUE INDEX "Clients_documento_key" ON "Clients"("documento");

-- CreateIndex
CREATE UNIQUE INDEX "Clients_email_key" ON "Clients"("email");

-- CreateIndex
CREATE INDEX "UserPermission_userId_idx" ON "UserPermission"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPermission_userId_resource_action_key" ON "UserPermission"("userId", "resource", "action");

-- AddForeignKey
ALTER TABLE "Contracts" ADD CONSTRAINT "Contracts_motorcycleId_fkey" FOREIGN KEY ("motorcycleId") REFERENCES "MotorCycle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contracts" ADD CONSTRAINT "Contracts_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
