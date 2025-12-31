/*
  Warnings:

  - You are about to drop the `Address` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Attribute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AttributeValue` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Brand` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Cart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CartEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CartItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CategoryAttribute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Chat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChatMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Delivery` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Ingredient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Interaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductIngredient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductSkinConcern` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductSkinType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductVariant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductVariantAttribute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Report` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Restock` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Section` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Shipment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SkinConcern` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SkinType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StockMovement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_userId_fkey";

-- DropForeignKey
ALTER TABLE "AttributeValue" DROP CONSTRAINT "AttributeValue_attributeId_fkey";

-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_userId_fkey";

-- DropForeignKey
ALTER TABLE "CartEvent" DROP CONSTRAINT "CartEvent_cartId_fkey";

-- DropForeignKey
ALTER TABLE "CartEvent" DROP CONSTRAINT "CartEvent_userId_fkey";

-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_cartId_fkey";

-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_variantId_fkey";

-- DropForeignKey
ALTER TABLE "CategoryAttribute" DROP CONSTRAINT "CategoryAttribute_attributeId_fkey";

-- DropForeignKey
ALTER TABLE "CategoryAttribute" DROP CONSTRAINT "CategoryAttribute_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_userId_fkey";

-- DropForeignKey
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_chatId_fkey";

-- DropForeignKey
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_senderId_fkey";

-- DropForeignKey
ALTER TABLE "Delivery" DROP CONSTRAINT "Delivery_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Interaction" DROP CONSTRAINT "Interaction_productId_fkey";

-- DropForeignKey
ALTER TABLE "Interaction" DROP CONSTRAINT "Interaction_userId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_orderId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_productVariantId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_brandId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "ProductIngredient" DROP CONSTRAINT "ProductIngredient_ingredientId_fkey";

-- DropForeignKey
ALTER TABLE "ProductIngredient" DROP CONSTRAINT "ProductIngredient_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductSkinConcern" DROP CONSTRAINT "ProductSkinConcern_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductSkinConcern" DROP CONSTRAINT "ProductSkinConcern_skinConcernId_fkey";

-- DropForeignKey
ALTER TABLE "ProductSkinType" DROP CONSTRAINT "ProductSkinType_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductSkinType" DROP CONSTRAINT "ProductSkinType_skinTypeId_fkey";

-- DropForeignKey
ALTER TABLE "ProductVariant" DROP CONSTRAINT "ProductVariant_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductVariantAttribute" DROP CONSTRAINT "ProductVariantAttribute_attributeId_fkey";

-- DropForeignKey
ALTER TABLE "ProductVariantAttribute" DROP CONSTRAINT "ProductVariantAttribute_valueId_fkey";

-- DropForeignKey
ALTER TABLE "ProductVariantAttribute" DROP CONSTRAINT "ProductVariantAttribute_variantId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_userId_fkey";

-- DropForeignKey
ALTER TABLE "Restock" DROP CONSTRAINT "Restock_userId_fkey";

-- DropForeignKey
ALTER TABLE "Restock" DROP CONSTRAINT "Restock_variantId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_productId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_userId_fkey";

-- DropForeignKey
ALTER TABLE "Shipment" DROP CONSTRAINT "Shipment_orderId_fkey";

-- DropForeignKey
ALTER TABLE "StockMovement" DROP CONSTRAINT "StockMovement_variantId_fkey";

-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_productId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_orderId_fkey";

-- DropTable
DROP TABLE "Address";

-- DropTable
DROP TABLE "Attribute";

-- DropTable
DROP TABLE "AttributeValue";

-- DropTable
DROP TABLE "Brand";

-- DropTable
DROP TABLE "Cart";

-- DropTable
DROP TABLE "CartEvent";

-- DropTable
DROP TABLE "CartItem";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "CategoryAttribute";

-- DropTable
DROP TABLE "Chat";

-- DropTable
DROP TABLE "ChatMessage";

-- DropTable
DROP TABLE "Delivery";

-- DropTable
DROP TABLE "Ingredient";

-- DropTable
DROP TABLE "Interaction";

-- DropTable
DROP TABLE "Order";

-- DropTable
DROP TABLE "OrderItem";

-- DropTable
DROP TABLE "Payment";

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "ProductIngredient";

-- DropTable
DROP TABLE "ProductSkinConcern";

-- DropTable
DROP TABLE "ProductSkinType";

-- DropTable
DROP TABLE "ProductVariant";

-- DropTable
DROP TABLE "ProductVariantAttribute";

-- DropTable
DROP TABLE "Report";

-- DropTable
DROP TABLE "Restock";

-- DropTable
DROP TABLE "Review";

-- DropTable
DROP TABLE "Section";

-- DropTable
DROP TABLE "Shipment";

-- DropTable
DROP TABLE "SkinConcern";

-- DropTable
DROP TABLE "SkinType";

-- DropTable
DROP TABLE "StockMovement";

-- DropTable
DROP TABLE "Tag";

-- DropTable
DROP TABLE "Transaction";

-- DropTable
DROP TABLE "users";

-- DropEnum
DROP TYPE "CART_EVENT";

-- DropEnum
DROP TYPE "CART_STATUS";

-- DropEnum
DROP TYPE "CHAT_STATUS";

-- DropEnum
DROP TYPE "DeliveryStatus";

-- DropEnum
DROP TYPE "OrderStatus";

-- DropEnum
DROP TYPE "PAYMENT_STATUS";

-- DropEnum
DROP TYPE "PaymentMethod";

-- DropEnum
DROP TYPE "PromotionType";

-- DropEnum
DROP TYPE "SECTION_TYPE";

-- DropEnum
DROP TYPE "SafetyLevel";

-- DropEnum
DROP TYPE "TRANSACTION_STATUS";

-- DropEnum
DROP TYPE "UserRole";
