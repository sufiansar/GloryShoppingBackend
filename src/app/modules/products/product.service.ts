import { deleteImageFromCLoudinary } from "../../config/cloudinary";
import { prisma } from "../../config/prisma";
import AppError from "../../errorHelpers/AppError";
import { PrismaQueryBuilder } from "../../utility/queryBuilder";
import { generateSlug } from "../../utility/slugGenerate";
import { productFilters } from "./product.filterableField";
import { IProduct } from "./product.interface";

const createProduct = async (payload: IProduct) => {
  const slug = generateSlug(payload.name);

  const existingProduct = await prisma.product.findUnique({
    where: { slug },
  });

  if (existingProduct) {
    throw new Error("Product with this slug already exists");
  }

  const productData = {
    name: payload.name,
    slug,
    description: payload.description ?? undefined,
    price: payload.price,
    discount: payload.discount ?? 0,
    stock: payload.stock,
    shortDesc: payload.shortDesc ?? undefined,
    longDesc: payload.longDesc ?? undefined,
    faquestions: payload.faquestions ?? undefined,
    thumbleImage: payload.thumbleImage ?? undefined,
    isNew: payload.isNew ?? false,
    isFeatured: payload.isFeatured ?? false,
    isTrending: payload.isTrending ?? false,
    isBestSeller: payload.isBestSeller ?? false,
    isActive: payload.isActive ?? true,
    brandId: payload.brandId,
    categoryId: payload.categoryId,
  };

  const newProduct = await prisma.product.create({
    data: productData,
  });

  return newProduct;
};

const getAllProducts = async (query: Record<string, string>) => {
  const primaQuery = new PrismaQueryBuilder(query)
    .filter(productFilters)
    .search(["name", "description"])
    .sort()
    .paginate()
    .build();

  const products = await prisma.product.findMany({
    ...primaQuery,
    include: {
      brand: true,
      category: true,
      reviews: true,
      variants: true,
      ingredients: true,
      skinTypes: true,

      concerns: true,
    },
  });
  return products;
};

const getProductById = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      brand: true,
      category: true,
      reviews: true,
      variants: true,
      ingredients: true,
      skinTypes: true,
      concerns: true,
    },
  });
  return product;
};

const updateProduct = async (id: string, productData: IProduct) => {
  const isExistingProduct = await prisma.product.findUnique({ where: { id } });
  if (!isExistingProduct) {
    throw new AppError(401, "Product not found", "");
  }

  if (productData.name) {
    const updatedSlug = generateSlug(productData.name);
    productData.slug = updatedSlug;
  }

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: productData,
  });
  if (productData.thumbleImage && isExistingProduct.thumbleImage) {
    await deleteImageFromCLoudinary(isExistingProduct.thumbleImage);
  }
  return updatedProduct;
};

const deleteProduct = async (id: string) => {
  return await prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({ where: { id } });
    if (!product) {
      throw new Error("Product not found");
    }

    if (product.thumbleImage) {
      await deleteImageFromCLoudinary(product.thumbleImage);
    }

    const deletedProduct = await tx.product.delete({
      where: { id },
    });
    return deletedProduct;
  });
};

export const ProductService = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
