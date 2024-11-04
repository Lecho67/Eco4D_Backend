/*
  Warnings:

  - The primary key for the `SolicitudSoporte` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `SolicitudSoporte` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `solicitudId` on the `Mensaje` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Mensaje" DROP CONSTRAINT "Mensaje_solicitudId_fkey";

-- AlterTable
ALTER TABLE "Mensaje" DROP COLUMN "solicitudId",
ADD COLUMN     "solicitudId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "SolicitudSoporte" DROP CONSTRAINT "SolicitudSoporte_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "SolicitudSoporte_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "Mensaje_solicitudId_idx" ON "Mensaje"("solicitudId");

-- AddForeignKey
ALTER TABLE "Mensaje" ADD CONSTRAINT "Mensaje_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "SolicitudSoporte"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
