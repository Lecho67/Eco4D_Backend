/*
  Warnings:

  - You are about to drop the column `fecha` on the `SolicitudSoporte` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[correo_electronico]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `autorId` to the `Mensaje` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Diagnostico" ALTER COLUMN "fecha" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "descripcion" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Mensaje" ADD COLUMN     "autorId" INTEGER NOT NULL,
ALTER COLUMN "descripcion" SET DATA TYPE TEXT,
ALTER COLUMN "fecha" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "SolicitudSoporte" DROP COLUMN "fecha",
ADD COLUMN     "fechaReporte" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fechaSolucion" TIMESTAMP(3),
ALTER COLUMN "descripcion" SET DATA TYPE TEXT;

-- CreateIndex
CREATE INDEX "Diagnostico_medicoId_idx" ON "Diagnostico"("medicoId");

-- CreateIndex
CREATE INDEX "Diagnostico_pacienteId_idx" ON "Diagnostico"("pacienteId");

-- CreateIndex
CREATE INDEX "Mensaje_solicitudId_idx" ON "Mensaje"("solicitudId");

-- CreateIndex
CREATE INDEX "Mensaje_autorId_idx" ON "Mensaje"("autorId");

-- CreateIndex
CREATE INDEX "SolicitudSoporte_solicitanteId_idx" ON "SolicitudSoporte"("solicitanteId");

-- CreateIndex
CREATE INDEX "SolicitudSoporte_encargadoId_idx" ON "SolicitudSoporte"("encargadoId");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_electronico_key" ON "Usuario"("correo_electronico");

-- AddForeignKey
ALTER TABLE "Mensaje" ADD CONSTRAINT "Mensaje_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "Usuario"("cedula") ON DELETE RESTRICT ON UPDATE CASCADE;
