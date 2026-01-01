/*
  Warnings:

  - You are about to drop the column `caution` on the `Ingredient` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ingredient" DROP COLUMN "caution",
ADD COLUMN     "benefits" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "precautions" TEXT,
ADD COLUMN     "sideEffects" TEXT,
ADD COLUMN     "usage" TEXT;
