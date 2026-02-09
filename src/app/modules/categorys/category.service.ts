import { includes } from "zod";
import { prisma } from "../../config/prisma";
import { PrismaQueryBuilder } from "../../utility/queryBuilder";
import { generateSlug } from "../../utility/slugGenerate";
import { ICreateCategory } from "./category.interface";
import { paginationHelper } from "../../utility/paginationField";

import { CategorySearchAbleFields } from "./category.filterableField";
import { Prisma } from "@prisma/client";

const createCategory = async (categoryData: ICreateCategory) => {
  if (!categoryData.images) {
    categoryData.images = [];
  }
  if (categoryData.name === undefined) {
    throw new Error("Category name is required");
  }
  const createSlug = generateSlug(categoryData.name);
  categoryData.slug = createSlug;
  const category = {
    slug: categoryData.slug,
    name: categoryData.name,
    description: categoryData.description || "",
    images: categoryData.images || [],
  };
  const result = await prisma.category.create({
    data: category,
  });
  return result;
};

const getAllCategories = async (
  filters: Record<string, any>,
  options: Record<string, any>,
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const { searchTerm, ...filterValues } = filters;
  const andConditions: Prisma.CategoryWhereInput[] = [];
  if (searchTerm) {
    andConditions.push({
      OR: CategorySearchAbleFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
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

  const whereConditions: Prisma.CategoryWhereInput =
    andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : {};

  const categories = await prisma.category.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: sortBy
      ? { [sortBy]: sortOrder?.toLowerCase() === "asc" ? "asc" : "desc" }
      : { createdAt: "desc" },
  });

  const total = await prisma.category.count({
    where: whereConditions,
  });

  return {
    data: categories,
    meta: {
      page,
      limit,
      total,
    },
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
    andConditions.push({
      OR: CategorySearchAbleFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
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

  const products = await prisma.product.findMany({
    where: {
      categoryId,
      ...whereConditions,
    },
    skip,
    take: limit,
    orderBy: sortBy
      ? { [sortBy]: sortOrder?.toLowerCase() === "asc" ? "asc" : "desc" }
      : { createdAt: "desc" },
    include: {
      brand: true,
      category: true,
    },
  });

  const total = await prisma.product.count({
    where: {
      categoryId,
      ...whereConditions,
    },
  });

  return {
    data: products,
    meta: {
      page,
      limit,
      total,
    },
  };
};

const getCategoryBySlug = async (slug: string) => {
  const category = await prisma.category.findUnique({
    where: { slug },

    include: {
      products: true,
    },
  });
  return category;
};

const getAllProductByCategoryBySlug = async (
  filters: Record<string, any>,
  options: Record<string, any>,
  slug: string,
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const { searchTerm, ...filterValues } = filters;
  const andConditions: Prisma.ProductWhereInput[] = [];
  if (searchTerm) {
    andConditions.push({
      OR: CategorySearchAbleFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
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

  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const products = await prisma.product.findMany({
    where: {
      categoryId: category.id,
      ...whereConditions,
    },
    skip,
    take: limit,
    orderBy: sortBy
      ? { [sortBy]: sortOrder?.toLowerCase() === "asc" ? "asc" : "desc" }
      : { createdAt: "desc" },
    include: {
      brand: true,
      category: true,
    },
  });

  const total = await prisma.product.count({
    where: {
      categoryId: category.id,
      ...whereConditions,
    },
  });

  return {
    data: products,
    meta: {
      page,
      limit,
      total,
    },
  };
};
const getSingleCategory = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      products: true,
    },
  });
  return category;
};

const updateCategory = async (
  id: string,
  categoryData: Partial<ICreateCategory>,
) => {
  if (categoryData.name) {
    const updatedSlug = generateSlug(categoryData.name);
    categoryData.slug = updatedSlug;
  }

  const updatedCategory = await prisma.category.update({
    where: { id },
    data: categoryData,
  });

  return updatedCategory;
};

const deleteCategory = async (id: string) => {
  const deletedCategory = await prisma.category.delete({
    where: { id },
  });
  return deletedCategory;
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
  getProductByCetegory,
  getAllProductByCategoryBySlug,
  getCategoryBySlug,
};
