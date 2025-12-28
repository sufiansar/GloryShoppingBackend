/*
  Warnings:

  - You are about to drop the column `currency` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ingredient" ADD COLUMN     "caution" TEXT,
ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "currency",
ADD COLUMN     "thumbleImage" TEXT;

-- AlterTable
ALTER TABLE "ProductVariant" ALTER COLUMN "price" DROP NOT NULL,
ALTER COLUMN "stock" DROP NOT NULL;

-- CreateTable
CREATE TABLE "ProductVideo" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "videos" TEXT[],
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductVideo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductVideo" ADD CONSTRAINT "ProductVideo_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
