/*
  Warnings:

  - Changed the type of `edadGestacional` on the `Diagnostico` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Diagnostico" DROP COLUMN "edadGestacional",
ADD COLUMN     "edadGestacional" INTEGER NOT NULL;
