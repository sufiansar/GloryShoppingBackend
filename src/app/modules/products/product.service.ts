import { Prisma } from "@prisma/client";
import { deleteImageFromCLoudinary } from "../../config/cloudinary";
import { prisma } from "../../config/prisma";
import AppError from "../../errorHelpers/AppError";
import { paginationHelper } from "../../utility/paginationField";
import { PrismaQueryBuilder } from "../../utility/queryBuilder";
import { generateSlug } from "../../utility/slugGenerate";
import { productSearchAbleFields } from "./product.filterableField";
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

// const getAllProducts = async (query: Record<string, string>) => {
//   const prismaQueryBuilder = new PrismaQueryBuilder(query)
//     .filter(productFilters)
//     .search(["name", "description"])
//     .sort()
//     .paginate();

//   const prismaQuery = prismaQueryBuilder.build();

//   const [products, meta] = await Promise.all([
//     prisma.product.findMany({
//       ...prismaQuery,
//       include: {
//         brand: true,
//         category: true,
//         reviews: true,
//         variants: {
//           include: {
//             attributes: true,
//             cartItems: true,
//             orderItems: true,
//           },
//         },
//         ingredients: {
//           include: {
//             ingredient: {
//               select: {
//                 name: true,
//                 description: true,
//                 benefits: true,
//                 sideEffects: true,
//                 usage: true,
//                 precautions: true,
//                 safetyLevel: true,
//                 isActive: true,
//               },
//             },
//           },
//         },
//         skinTypes: {
//           include: {
//             skinType: {
//               select: { name: true },
//             },
//           },
//         },
//         concerns: {
//           include: {
//             skinConcern: {
//               select: { name: true },
//             },
//           },
//         },
//       },
//       orderBy: { createdAt: "desc" },
//     }),
//     prismaQueryBuilder.getMeta(prisma.product),
//   ]);

//   return {
//     data: products,
//     meta,
//   };
// };
// const getAllProducts = async (query: Record<string, string>) => {
//   const searchTerm = query.searchTerm?.trim();
//   const page = Number(query.page) || 1;
//   const limit = Number(query.limit) || 10;
//   const skip = (page - 1) * limit;

//   // Base filters
//   const baseWhere: any = {};
//   for (const key in query) {
//     if ((productFilters as Record<string, (value: string) => any>)[key]) {
//       baseWhere[key] = (
//         productFilters as Record<string, (value: string) => any>
//       )[key](query[key]);
//     }
//   }

//   // Build OR only for non-nullable fields
//   const searchFields = ["name", "slug"]; // always non-null
//   const optionalFields = ["description", "shortDesc", "longDesc"];

//   const orConditions: any[] = [];

//   searchFields.forEach((f) => {
//     if (searchTerm)
//       orConditions.push({ [f]: { contains: searchTerm, mode: "insensitive" } });
//   });

//   optionalFields.forEach((f) => {
//     if (searchTerm)
//       orConditions.push({ [f]: { contains: searchTerm, mode: "insensitive" } });
//   });

//   const where = orConditions.length
//     ? { AND: [baseWhere, { OR: orConditions }] }
//     : baseWhere;

//   const [products, total] = await Promise.all([
//     prisma.product.findMany({
//       where,
//       skip,
//       take: limit,
//       orderBy: { createdAt: "desc" },
//       include: {
//         brand: true,
//         category: true,
//         reviews: true,
//         variants: {
//           include: { attributes: true, cartItems: true, orderItems: true },
//         },
//         ingredients: { include: { ingredient: { select: { name: true } } } },
//         skinTypes: { include: { skinType: { select: { name: true } } } },
//         concerns: { include: { skinConcern: { select: { name: true } } } },
//       },
//     }),
//     prisma.product.count({ where }),
//   ]);

//   return {
//     data: products,
//     meta: {
//       page,
//       limit,
//       total,
//       totalPage: Math.ceil(total / limit),
//     },
//   };
// };

const getAllProducts = async (
  filters: Record<string, any>,
  options: Record<string, any>,
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const { searchTerm, ...filterValues } = filters;

  const andConditions: Prisma.ProductWhereInput[] = [];
  if (searchTerm) {
    const searchWords = searchTerm.trim().split(/\s+/);

    andConditions.push({
      AND: searchWords.map((word: any) => ({
        OR: productSearchAbleFields.map((field) => ({
          [field]: {
            contains: word,
            mode: "insensitive",
          },
        })),
      })),
    });
  }

  if (Object.keys(filterValues).length > 0) {
    andConditions.push({
      AND: Object.keys(filterValues).map((key) => ({
        [key]: {
          equals: filterValues[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.ProductWhereInput =
    andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : {};

  const result = await prisma.product.findMany({
    skip,
    take: limit,
    where: {
      AND: whereConditions,
    },
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
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.product.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};
const getProductByCetegory = async (
  filters: Record<string, any>,
  options: Record<string, any>,

  categoryId: string,
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const { searchTerm, ...filterValues } = filters;

  const andConditions: Prisma.ProductWhereInput[] = [];
  if (searchTerm) {
    const searchWords = searchTerm.trim().split(/\s+/);

    andConditions.push({
      AND: searchWords.map((word: any) => ({
        OR: productSearchAbleFields.map((field) => ({
          [field]: {
            contains: word,
            mode: "insensitive",
          },
        })),
      })),
    });
  }

  if (Object.keys(filterValues).length > 0) {
    andConditions.push({
      AND: Object.keys(filterValues).map((key) => ({
        [key]: {
          equals: filterValues[key],
        },
      })),
    });
  }

  andConditions.push({ categoryId });

  const whereConditions: Prisma.ProductWhereInput =
    andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : {};

  const result = await prisma.product.findMany({
    skip,
    take: limit,
    where: {
      AND: whereConditions,
    },
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
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.product.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// const getProductBySlug = async (
//   query: Record<string, string>,
//   slug: string,
// ) => {
//   const prismaQueryBuilder = new PrismaQueryBuilder(query)
//     .search(["name", "description", " shortDesc", "longDesc", "slug"])
//     .filter()
//     .sort()
//     .paginate();

//   const prismaQuery = prismaQueryBuilder.build();

//   const product = await prisma.product.findFirst({
//     where: { slug },
//     ...prismaQuery,
//     include: {
//       brand: true,
//       category: true,
//       reviews: true,
//       variants: {
//         include: {
//           attributes: true,
//           cartItems: true,
//           orderItems: true,
//         },
//       },
//       ingredients: {
//         include: {
//           ingredient: {
//             select: {
//               name: true,
//               description: true,
//               benefits: true,
//               sideEffects: true,
//               usage: true,
//               precautions: true,
//               safetyLevel: true,
//               isActive: true,
//             },
//           },
//         },
//       },
//       skinTypes: {
//         include: {
//           skinType: {
//             select: { name: true },
//           },
//         },
//       },
//       concerns: {
//         include: {
//           skinConcern: {
//             select: { name: true },
//           },
//         },
//       },
//     },
//   });
//   return product;
// };

const getProductBySlug = async (slug: string) => {
  const product = await prisma.product.findUnique({
    where: {
      slug, // only unique field
    },
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

const getBestSellingProducts = async (
  filters: Record<string, any>,
  options: Record<string, any>,
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);

  const { searchTerm, ...filterValues } = filters;

  const andConditions: Prisma.ProductWhereInput[] = [];

  // 🔍 search
  if (searchTerm) {
    const searchWords = searchTerm.trim().split(/\s+/);

    andConditions.push({
      AND: searchWords.map((word: any) => ({
        OR: productSearchAbleFields.map((field) => ({
          [field]: {
            contains: word,
            mode: "insensitive",
          },
        })),
      })),
    });
  }

  // 🎛 dynamic filters
  if (Object.keys(filterValues).length > 0) {
    andConditions.push({
      AND: Object.keys(filterValues).map((key) => ({
        [key]: {
          equals: filterValues[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.ProductWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  // 📦 fetch full products
  const products = await prisma.product.findMany({
    where: whereConditions,
    include: {
      brand: true,
      category: true,
      reviews: true,
      variants: {
        include: {
          attributes: true,
          orderItems: {
            where: {
              order: {
                status: "COMPLETED", // ✅ accuracy
              },
            },
            select: {
              quantity: true,
            },
          },
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
          skinType: { select: { name: true } },
        },
      },
      concerns: {
        include: {
          skinConcern: { select: { name: true } },
        },
      },
    },
  });

  // 🔥 calculate & sort by real sales
  const bestSelling = products
    .map((product: any) => {
      const totalSold = product.variants.reduce((pSum: any, variant: any) => {
        return (
          pSum +
          variant.orderItems.reduce(
            (vSum: any, item: any) => vSum + item.quantity,
            0,
          )
        );
      }, 0);

      return { ...product, totalSold };
    })
    .filter((p: any) => p.totalSold > 0)
    .sort((a: any, b: any) => b.totalSold - a.totalSold);

  // 📄 pagination after accurate sorting
  const paginatedData = bestSelling.slice(skip, skip + limit);

  return {
    meta: {
      page,
      limit,
      total: bestSelling.length,
    },
    data: paginatedData,
  };
};

const getProductByBrand = async (
  filters: Record<string, any>,
  options: Record<string, any>,
  brandId: string,
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const { searchTerm, ...filterValues } = filters;

  const andConditions: Prisma.ProductWhereInput[] = [];
  if (searchTerm) {
    const searchWords = searchTerm.trim().split(/\s+/);

    andConditions.push({
      AND: searchWords.map((word: any) => ({
        OR: productSearchAbleFields.map((field) => ({
          [field]: {
            contains: word,
            mode: "insensitive",
          },
        })),
      })),
    });
  }

  if (Object.keys(filterValues).length > 0) {
    andConditions.push({
      AND: Object.keys(filterValues).map((key) => ({
        [key]: {
          equals: filterValues[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.ProductWhereInput =
    andConditions.length > 0
      ? {
          AND: [...andConditions, { brandId }],
        }
      : { brandId };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      skip,
      take: limit,
      where: {
        AND: whereConditions,
      },
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
      orderBy: {
        [sortBy]: sortOrder,
      },
    }),
    prisma.product.count({
      where: whereConditions,
    }),
  ]);

  return {
    data: products,
    meta: {
      page,
      limit,
      total,
    },
  };
};

const getProductBySkinType = async (
  filters: Record<string, any>,
  options: Record<string, any>,
  skinTypeId: string,
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const { searchTerm, ...filterValues } = filters;

  const andConditions: Prisma.ProductWhereInput[] = [];
  if (searchTerm) {
    const searchWords = searchTerm.trim().split(/\s+/);

    andConditions.push({
      AND: searchWords.map((word: any) => ({
        OR: productSearchAbleFields.map((field) => ({
          [field]: {
            contains: word,
            mode: "insensitive",
          },
        })),
      })),
    });
  }

  if (Object.keys(filterValues).length > 0) {
    andConditions.push({
      AND: Object.keys(filterValues).map((key) => ({
        [key]: {
          equals: filterValues[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.ProductWhereInput =
    andConditions.length > 0
      ? {
          AND: [...andConditions, { skinTypes: { some: { skinTypeId } } }],
        }
      : { skinTypes: { some: { skinTypeId } } };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      skip,
      take: limit,
      where: {
        AND: whereConditions,
      },
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
      orderBy: {
        [sortBy]: sortOrder,
      },
    }),
    prisma.product.count({
      where: whereConditions,
    }),
  ]);

  return {
    data: products,
    meta: {
      page,
      limit,
      total,
    },
  };
};

const getProductBySkinConcern = async (
  filters: Record<string, any>,
  options: Record<string, any>,
  skinConcernId: string,
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const { searchTerm, ...filterValues } = filters;

  const andConditions: Prisma.ProductWhereInput[] = [];
  if (searchTerm) {
    const searchWords = searchTerm.trim().split(/\s+/);

    andConditions.push({
      AND: searchWords.map((word: any) => ({
        OR: productSearchAbleFields.map((field) => ({
          [field]: {
            contains: word,
            mode: "insensitive",
          },
        })),
      })),
    });
  }
  if (Object.keys(filterValues).length > 0) {
    andConditions.push({
      AND: Object.keys(filterValues).map((key) => ({
        [key]: {
          equals: filterValues[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.ProductWhereInput =
    andConditions.length > 0
      ? {
          AND: [...andConditions, { concerns: { some: { skinConcernId } } }],
        }
      : { concerns: { some: { skinConcernId } } };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      skip,
      take: limit,
      where: {
        AND: whereConditions,
      },
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
      orderBy: {
        [sortBy]: sortOrder,
      },
    }),
    prisma.product.count({
      where: whereConditions,
    }),
  ]);

  return {
    data: products,
    meta: {
      page,
      limit,
      total,
    },
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
  return await prisma.$transaction(async (tx: any) => {
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
  getBestSellingProducts,
};
