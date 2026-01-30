import { includes } from "zod";
import { prisma } from "../../config/prisma";
import { PrismaQueryBuilder } from "../../utility/queryBuilder";
import { generateSlug } from "../../utility/slugGenerate";
import { ICreateCategory } from "./category.interface";

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

const getAllCategories = async (query: Record<string, string>) => {
  const prismaQueryBuilder = new PrismaQueryBuilder(query)
    .filter()
    .search(["name", "description"])
    .sort()
    .paginate();

  const prismaQuery = prismaQueryBuilder.build();

  const [categories, meta] = await Promise.all([
    prisma.category.findMany({
      ...prismaQuery,
      include: {
        products: true,
      },
    }),
    prismaQueryBuilder.getMeta(prisma.category),
  ]);

  return {
    data: categories,
    meta,
  };
};

const getProductByCetegory = async (categoryId: string) => {
  const prismaQueryBuilder = new PrismaQueryBuilder({})
    .search(["name", "description"])
    .filter()
    .sort()
    .paginate();

  const prismaQuery = prismaQueryBuilder.build();

  const products = await prisma.product.findMany({
    where: {
      categoryId,
    },
    ...prismaQuery,
    include: {
      brand: true,
      category: true,
    },
  });
  return products;
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

const getAllProductByCategoryBySlug = async (slug: string) => {
  const prismaQueryBuilder = new PrismaQueryBuilder({})
    .search(["name", "description"])
    .filter()
    .sort()
    .paginate();

  const prismaQuery = prismaQueryBuilder.build();

  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const products = await prisma.product.findMany({
    where: {
      categoryId: category.id,
    },
    ...prismaQuery,
    include: {
      brand: true,
      category: true,
    },
  });
  return products;
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
