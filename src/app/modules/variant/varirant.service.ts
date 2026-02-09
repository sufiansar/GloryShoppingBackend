import { deleteImageFromCLoudinary } from "../../config/cloudinary";
import { prisma } from "../../config/prisma";
import { PrismaQueryBuilder } from "../../utility/queryBuilder";
import { generateSKU } from "../../utility/skuGenerator";
import { CreateProductVariant } from "./variant.interface";

const createProductVariant = async (data: CreateProductVariant) => {
  const product = await prisma.product.findUnique({
    where: {
      id: data.productId,
    },
    select: {
      name: true,

      price: true,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  const sku = generateSKU(product.name, data.size);
  const variant = {
    size: data.size,
    sku,
    images: data.images,
    price: data.price || product.price || 0,
    stock: data.stock || 0,
    lowStockThreshold: data.lowStockThreshold || 0,
  };

  const createdVariant = await prisma.productVariant.create({
    data: {
      ...variant,
      productId: data.productId,
    },
  });
  return createdVariant;
};

const getAllVariants = async (query: Record<string, string>) => {
  const prismaQueryBuilder = new PrismaQueryBuilder(query)
    .filter()
    .sort()
    .paginate();

  const prismaQuery = prismaQueryBuilder.build();

  const [variants, meta] = await Promise.all([
    prisma.productVariant.findMany({
      ...prismaQuery,
      orderBy: { createdAt: "desc" },
    }),
    prismaQueryBuilder.getMeta(prisma.productVariant),
  ]);

  return {
    data: variants,
    meta,
  };
};

const getVariantBySku = async (sku: string) => {
  const variant = await prisma.productVariant.findUnique({
    where: { sku },
  });
  return variant;
};

const getVariaantById = async (id: string) => {
  const variant = await prisma.productVariant.findUnique({
    where: { id },
  });
  return variant;
};
const updateVariant = async (
  id: string,
  variantData: Partial<CreateProductVariant>,
) => {
  const product = await prisma.product.findUnique({
    where: { id: variantData.productId || "" },
    select: {
      name: true,
    },
  });
  if (variantData.size && product) {
    const updatedSKU = generateSKU(product.name, variantData.size);
    variantData.sku = updatedSKU;
  }
  const existingVariant = await prisma.productVariant.findUnique({
    where: { id },
  });
  if (!existingVariant) {
    throw new Error("Variant not found");
  }

  const updatedVariant = await prisma.productVariant.update({
    where: { id },
    data: variantData,
  });

  if (variantData.images && existingVariant.images) {
    for (const imageUrl of existingVariant.images) {
      if (!variantData.images.includes(imageUrl)) {
        await deleteImageFromCLoudinary(imageUrl);
      }
    }
  }
  return updatedVariant;
};

const deleteVariant = async (id: string) => {
  return await prisma.$transaction(async (tx: any) => {
    const variant = await tx.productVariant.findUnique({ where: { id } });
    if (!variant) {
      throw new Error("Variant not found");
    }

    for (const imageUrl of variant.images) {
      await deleteImageFromCLoudinary(imageUrl);
    }

    const deletedVariant = await tx.productVariant.delete({
      where: { id },
    });
    return deletedVariant;
  });
};

export const VariantService = {
  createProductVariant,
  getAllVariants,
  getVariantBySku,
  updateVariant,
  deleteVariant,
  getVariaantById,
};
