-- CreateTable
CREATE TABLE "MotorCycle" (
    "id" TEXT NOT NULL,
    "cor" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "ano" TEXT NOT NULL,
    "chassi" TEXT NOT NULL,
    "renavam" TEXT NOT NULL,
    "km" TEXT NOT NULL,
    "valor_compra" INTEGER NOT NULL,
    "valor_venda" INTEGER NOT NULL,
    "valor_fipe" INTEGER NOT NULL,
    "observacao" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MotorCycle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MotorCycle_chassi_key" ON "MotorCycle"("chassi");

-- CreateIndex
CREATE UNIQUE INDEX "MotorCycle_renavam_key" ON "MotorCycle"("renavam");
