-- AlterTable
ALTER TABLE "Delivery" ADD COLUMN     "deliveryCharge" DOUBLE PRECISION,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "postalCode" TEXT,
ALTER COLUMN "status" SET DEFAULT 'PROCESSING';
