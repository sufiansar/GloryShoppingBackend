-- DropIndex
DROP INDEX "Product_name_slug_idx";

-- CreateIndex
CREATE INDEX "Product_name_slug_brandId_categoryId_isActive_isFeatured_is_idx" ON "Product"("name", "slug", "brandId", "categoryId", "isActive", "isFeatured", "isTrending", "isBestSeller");
