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
    price: Number(payload.price),
    discount: Number(payload.discount ?? 0),
    stock: Number(payload.stock),
    shortDesc: payload.shortDesc ?? undefined,
    longDesc: payload.longDesc ?? undefined,
    faquestions: payload.faquestions ?? undefined,
    thumbleImage: payload.thumbleImage ?? undefined,
    isNew: Boolean(payload.isNew),
    isFeatured: Boolean(payload.isFeatured),
    isTrending: Boolean(payload.isTrending),
    isBestSeller: Boolean(payload.isBestSeller),
    isActive: payload.isActive === false ? false : true,
    brandId: payload.brandId,
    categoryId: payload.categoryId,
  };

  return prisma.product.create({
    data: productData,
  });
};

const getAllProducts = async (query: Record<string, string>) => {
  const prismaQueryBuilder = new PrismaQueryBuilder(query)
    .filter(productFilters)
    .search(["name", "description"])
    .sort()
    .paginate();

  const prismaQuery = prismaQueryBuilder.build();

  const [products, meta] = await Promise.all([
    prisma.product.findMany({
      ...prismaQuery,
      include: {
        brand: true,
        category: true,
        reviews: true,
        variants: {
          include: {
            attributes: true,
            cartItems: true,
            orderItems: true,
          },
        },
        ingredients: {
          include: {
            ingredient: {
              select: {
                name: true,
                description: true,
                benefits: true,
                sideEffects: true,
                usage: true,
                precautions: true,
                safetyLevel: true,
                isActive: true,
              },
            },
          },
        },
        skinTypes: {
          include: {
            skinType: {
              select: { name: true },
            },
          },
        },
        concerns: {
          include: {
            skinConcern: {
              select: { name: true },
            },
          },
        },
      },
    }),
    prismaQueryBuilder.getMeta(prisma.product),
  ]);

  return {
    data: products,
    meta,
  };
};

const getProductByCetegory = async (
  query: Record<string, string>,
  categoryId: string,
) => {
  const prismaQueryBuilder = new PrismaQueryBuilder(query)
    .search(["name", "description", "shortDesc", "longDesc", "slug"])
    .filter()
    .sort()
    .paginate();

  const prismaQuery = prismaQueryBuilder.build();

  const [products, meta] = await Promise.all([
    prisma.product.findMany({
      where: { categoryId },
      ...prismaQuery,
      include: {
        brand: true,
        category: true,
        reviews: true,
        variants: {
          include: {
            attributes: true,
            cartItems: true,
            orderItems: true,
          },
        },
        ingredients: {
          include: {
            ingredient: {
              select: {
                name: true,
                description: true,
                benefits: true,
                sideEffects: true,
                usage: true,
                precautions: true,
                safetyLevel: true,
                isActive: true,
              },
            },
          },
        },
        skinTypes: {
          include: {
            skinType: {
              select: { name: true },
            },
          },
        },
        concerns: {
          include: {
            skinConcern: {
              select: { name: true },
            },
          },
        },
      },
    }),
    prismaQueryBuilder.getMeta(prisma.product),
  ]);

  return {
    data: products,
    meta,
  };
};

const getProductBySlug = async (
  query: Record<string, string>,
  slug: string,
) => {
  const prismaQueryBuilder = new PrismaQueryBuilder(query)
    .search(["name", "description", " shortDesc", "longDesc", "slug"])
    .filter()
    .sort()
    .paginate();

  const prismaQuery = prismaQueryBuilder.build();

  const product = await prisma.product.findFirst({
    where: { slug },
    ...prismaQuery,
    include: {
      brand: true,
      category: true,
      reviews: true,
      variants: {
        include: {
          attributes: true,
          cartItems: true,
          orderItems: true,
        },
      },
      ingredients: {
        include: {
          ingredient: {
            select: {
              name: true,
              description: true,
              benefits: true,
              sideEffects: true,
              usage: true,
              precautions: true,
              safetyLevel: true,
              isActive: true,
            },
          },
        },
      },
      skinTypes: {
        include: {
          skinType: {
            select: { name: true },
          },
        },
      },
      concerns: {
        include: {
          skinConcern: {
            select: { name: true },
          },
        },
      },
    },
  });
  return product;
};
const getProductById = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      brand: true,
      category: true,
      reviews: true,
      variants: {
        include: {
          attributes: true,
          cartItems: true,
          orderItems: true,
        },
      },
      ingredients: {
        include: {
          ingredient: {
            select: {
              name: true,
              description: true,
              benefits: true,
              sideEffects: true,
              usage: true,
              precautions: true,
              safetyLevel: true,
              isActive: true,
            },
          },
        },
      },
      skinTypes: {
        include: {
          skinType: {
            select: { name: true },
          },
        },
      },
      concerns: {
        include: {
          skinConcern: {
            select: { name: true },
          },
        },
      },
    },
  });
  return product;
};

const getProductByBrand = async (
  query: Record<string, string>,
  brandId: string,
) => {
  const prismaQueryBuilder = new PrismaQueryBuilder(query)
    .search(["name", "description", " shortDesc", "longDesc", "slug"])
    .filter()
    .sort()
    .paginate();

  const prismaQuery = prismaQueryBuilder.build();

  const products = await prisma.product.findMany({
    where: { brandId },
    ...prismaQuery,
    include: {
      brand: true,
      category: true,
      reviews: true,
      variants: {
        include: {
          attributes: true,
          cartItems: true,
          orderItems: true,
        },
      },
      ingredients: {
        include: {
          ingredient: {
            select: {
              name: true,
              description: true,
              benefits: true,
              sideEffects: true,
              usage: true,
              precautions: true,
              safetyLevel: true,
              isActive: true,
            },
          },
        },
      },
      skinTypes: {
        include: {
          skinType: {
            select: { name: true },
          },
        },
      },
      concerns: {
        include: {
          skinConcern: {
            select: { name: true },
          },
        },
      },
    },
  });

  return products;
};

const getProductBySkinType = async (
  query: Record<string, string>,
  skinTypeId: string,
) => {
  const prismaQueryBuilder = new PrismaQueryBuilder(query)
    .search(["name", "description", " shortDesc", "longDesc", "slug"])
    .filter()
    .sort()
    .paginate();

  const prismaQuery = prismaQueryBuilder.build();

  const [products, meta] = await Promise.all([
    prisma.product.findMany({
      where: {
        skinTypes: {
          some: {
            skinTypeId,
          },
        },
      },
      ...prismaQuery,
      include: {
        brand: true,
        category: true,
        reviews: true,
        variants: {
          include: {
            attributes: true,
            cartItems: true,
            orderItems: true,
          },
        },
        ingredients: {
          include: {
            ingredient: {
              select: {
                name: true,
                description: true,
                benefits: true,
                sideEffects: true,
                usage: true,
                precautions: true,
                safetyLevel: true,
                isActive: true,
              },
            },
          },
        },
        skinTypes: {
          include: {
            skinType: {
              select: { name: true },
            },
          },
        },
        concerns: {
          include: {
            skinConcern: {
              select: { name: true },
            },
          },
        },
      },
    }),
    prismaQueryBuilder.getMeta(prisma.product),
  ]);

  return {
    data: products,
    meta,
  };
};

const getProductBySkinConcern = async (
  query: Record<string, string>,
  skinConcernId: string,
) => {
  const prismaQueryBuilder = new PrismaQueryBuilder(query)
    .search(["name", "description", " shortDesc", "longDesc", "slug"])
    .filter()
    .sort()
    .paginate();

  const prismaQuery = prismaQueryBuilder.build();

  const [products, meta] = await Promise.all([
    prisma.product.findMany({
      where: {
        concerns: {
          some: {
            skinConcernId,
          },
        },
      },
      ...prismaQuery,
      include: {
        brand: true,
        category: true,
        reviews: true,
        variants: {
          include: {
            attributes: true,
            cartItems: true,
            orderItems: true,
          },
        },
        ingredients: {
          include: {
            ingredient: {
              select: {
                name: true,
                description: true,
                benefits: true,
                sideEffects: true,
                usage: true,
                precautions: true,
                safetyLevel: true,
                isActive: true,
              },
            },
          },
        },
        skinTypes: {
          include: {
            skinType: {
              select: { name: true },
            },
          },
        },
        concerns: {
          include: {
            skinConcern: {
              select: { name: true },
            },
          },
        },
      },
    }),
    prismaQueryBuilder.getMeta(prisma.product),
  ]);

  return {
    data: products,
    meta,
  };
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
  getProductBySlug,
  getProductByBrand,
  getProductBySkinType,
  getProductBySkinConcern,
  getProductByCetegory,
};
