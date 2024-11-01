/*
  Warnings:

  - The primary key for the `Usuario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cedula` on the `Usuario` table. All the data in the column will be lost.
  - Added the required column `ciudad` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fecha_nacimiento` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `identificacion` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pais` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoIdentificacion` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Diagnostico" DROP CONSTRAINT "Diagnostico_medicoId_fkey";

-- DropForeignKey
ALTER TABLE "Diagnostico" DROP CONSTRAINT "Diagnostico_pacienteId_fkey";

-- DropForeignKey
ALTER TABLE "Mensaje" DROP CONSTRAINT "Mensaje_autorId_fkey";

-- DropForeignKey
ALTER TABLE "SolicitudSoporte" DROP CONSTRAINT "SolicitudSoporte_solicitanteId_fkey";

-- AlterTable
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_pkey",
DROP COLUMN "cedula",
ADD COLUMN     "ciudad" TEXT NOT NULL,
ADD COLUMN     "fecha_nacimiento" DATE NOT NULL,
ADD COLUMN     "identificacion" INTEGER NOT NULL,
ADD COLUMN     "pais" TEXT NOT NULL,
ADD COLUMN     "tipoIdentificacion" TEXT NOT NULL,
ALTER COLUMN "rol" SET DEFAULT 'P',
ADD CONSTRAINT "Usuario_pkey" PRIMARY KEY ("identificacion");

-- AddForeignKey
ALTER TABLE "Diagnostico" ADD CONSTRAINT "Diagnostico_medicoId_fkey" FOREIGN KEY ("medicoId") REFERENCES "Usuario"("identificacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagnostico" ADD CONSTRAINT "Diagnostico_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "Usuario"("identificacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolicitudSoporte" ADD CONSTRAINT "SolicitudSoporte_solicitanteId_fkey" FOREIGN KEY ("solicitanteId") REFERENCES "Usuario"("identificacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mensaje" ADD CONSTRAINT "Mensaje_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "Usuario"("identificacion") ON DELETE RESTRICT ON UPDATE CASCADE;
