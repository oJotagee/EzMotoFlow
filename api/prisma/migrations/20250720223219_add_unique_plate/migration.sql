/*
  Warnings:

  - A unique constraint covering the columns `[placa]` on the table `MotorCycle` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MotorCycle_placa_key" ON "MotorCycle"("placa");
