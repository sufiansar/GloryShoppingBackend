import { Prisma } from "../../../generated/prisma";
import { deleteImageFromCLoudinary } from "../../config/cloudinary";
import { prisma } from "../../config/prisma";
import { paginationHelper } from "../../utility/paginationField";
import { PrismaQueryBuilder } from "../../utility/queryBuilder";
import { generateSlug } from "../../utility/slugGenerate";
import { BrandSearchAbleFields } from "./brand.constant";
import { ICreateBrand } from "./brand.interface";

const createBrand = async (brand: Partial<ICreateBrand>) => {
  if (!brand.name) {
    throw new Error("Brand name is required");
  }

  const slugGenerate = generateSlug(brand.name);

  const newBrand = {
    name: brand.name,
    slug: slugGenerate,
    country: brand.country || null,
    logoUrl: brand.logoUrl || null,
  };

  const brandCreated = await prisma.brand.create({
    data: newBrand,
  });

  return brandCreated;
};

const getAllBrands = async (
  filters: Record<string, any>,
  options: Record<string, any>,
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const { searchTerm, ...filterValues } = filters;
  const andConditions: Prisma.BrandWhereInput[] = [];
  if (searchTerm) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      ],
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

  const whereConditions: Prisma.BrandWhereInput =
    andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : {};

  const brands = await prisma.brand.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.brand.count({
    where: whereConditions,
  });

  return {
    data: brands,
    meta: {
      page,
      limit,
      total,
    },
  };
};

const getBrandBySlugWithProducts = async (
  filter: Record<string, any>,
  options: Record<string, any>,
  slug: string,
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const { searchTerm, ...filterValues } = filter;
  const andConditions: Prisma.ProductWhereInput[] = [];
  if (searchTerm) {
    const searchWords = searchTerm.trim().split(/\s+/);

    andConditions.push({
      AND: searchWords.map((word: any) => ({
        OR: BrandSearchAbleFields.map((field) => ({
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

  const brandWithProducts = await prisma.brand.findUnique({
    where: { slug },
    include: {
      products: {
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
      },
    },
  });

  if (!brandWithProducts) {
    throw new Error("Brand not found");
  }

  const total = await prisma.product.count({
    where: {
      brandId: brandWithProducts.id,
      ...whereConditions,
    },
  });

  return {
    data: brandWithProducts,
    meta: {
      page,
      limit,
      total,
    },
  };
};

const getBrandById = async (id: string) => {
  const brand = await prisma.brand.findUnique({
    where: { id },
  });
  return brand;
};

const updateBrand = async (id: string, brandData: any) => {
  const existigBrand = await prisma.brand.findUnique({ where: { id } });
  if (brandData.name) {
    const updatedSlug = generateSlug(brandData.name);
    brandData.slug = updatedSlug;
  }

  const updatedBrand = await prisma.brand.update({
    where: { id },
    data: brandData,
  });
  if (brandData.logoUrl && existigBrand?.logoUrl) {
    await deleteImageFromCLoudinary(existigBrand.logoUrl);
  }
  return updatedBrand;
};

const deleteBrand = async (id: string) => {
  return await prisma.$transaction(async (tx) => {
    const brand = await prisma.brand.findUnique({ where: { id } });
    if (!brand) {
      throw new Error("Brand not found");
    }

    if (brand.logoUrl) {
      await deleteImageFromCLoudinary(brand.logoUrl);
    }

    const deletedBrand = await prisma.brand.delete({
      where: { id },
    });
    return deletedBrand;
  });
};

export const BrandService = {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
  getBrandBySlugWithProducts,
};
